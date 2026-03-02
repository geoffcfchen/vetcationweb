// src/pages/app/PetHealthLayout.jsx
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import { doc, getDoc } from "firebase/firestore";

import {
  FiChevronRight,
  FiCreditCard,
  FiFolder,
  FiPlus,
  FiSettings,
  FiShare2,
  FiUpload,
  FiX,
  FiShield,
  FiInfo,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import { signOut } from "firebase/auth";

import GlobalContext from "../../context/GlobalContext";
import { auth, firestore } from "../../lib/firebase";
import { useGetUserPets } from "../../hooks/useGetUserPets";

import { DateTime } from "luxon";

import logo from "../../images/plain_icon_600.png";
import PetEditorModal from "../../components/PetEditorModal";
import PassportEditModal from "../../components/PassportEditModal";

const petSummaryShape = PropTypes.shape({
  id: PropTypes.string,
  photoURL: PropTypes.string,
  displayName: PropTypes.string,
  type: PropTypes.string,
  species: PropTypes.string,
});

const LayoutBrandBar = React.memo(function LayoutBrandBar({
  uid,
  userLabel,
  userEmail,
  userPhoto,
  showProfileMenu,
  profileMenuRef,
  onGoHome,
  onOpenHow,
  onGoSupport,
  onToggleProfileMenu,
  onLogout,
}) {
  const getUserInitials = useCallback(() => {
    const name = (userLabel || "").trim();
    if (!name) return "U";
    const parts = name.split(/\s+/);
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      (parts[0].charAt(0) || "").toUpperCase() +
      (parts[1].charAt(0) || "").toUpperCase()
    );
  }, [userLabel]);

  return (
    <BrandBar>
      <BrandBarInner>
        <BrandBarLeft
          type="button"
          onClick={onGoHome}
          aria-label="Go to homepage"
          title="Go to homepage"
        >
          <BrandMark>
            <BrandLogo src={logo} alt="MyPet Health" />
            <BrandTextStack>
              <BrandBarTitle>MyPet Health</BrandBarTitle>
              <BrandBarSub>by Vetcation</BrandBarSub>
            </BrandTextStack>
          </BrandMark>
        </BrandBarLeft>

        <BrandBarRight>
          {uid && (
            <ProfileShell ref={profileMenuRef}>
              <UserAvatarButton
                type="button"
                onClick={onToggleProfileMenu}
                aria-label="Account menu"
                title={userLabel}
              >
                {userPhoto ? (
                  <UserAvatarImage src={userPhoto} alt={userLabel} />
                ) : (
                  <UserAvatarInitials>{getUserInitials()}</UserAvatarInitials>
                )}
              </UserAvatarButton>

              {showProfileMenu && (
                <ProfileMenu onClick={(e) => e.stopPropagation()}>
                  <ProfileMenuHeader>
                    <FiUser />
                    <ProfileMenuHeaderText>
                      <ProfileName title={userLabel}>{userLabel}</ProfileName>
                      {!!userEmail && (
                        <ProfileEmail title={userEmail}>
                          {userEmail}
                        </ProfileEmail>
                      )}
                    </ProfileMenuHeaderText>
                  </ProfileMenuHeader>

                  <ProfileMenuDivider />

                  <ProfileMenuItem type="button" onClick={onLogout}>
                    <FiLogOut />
                    <span>Log out</span>
                  </ProfileMenuItem>
                </ProfileMenu>
              )}
            </ProfileShell>
          )}
        </BrandBarRight>
      </BrandBarInner>
    </BrandBar>
  );
});

const LayoutSidebar = React.memo(function LayoutSidebar({
  pets,
  petsLoading,
  onOpenCreatePet,
  onOpenHow,
  onGoSupport,
}) {
  return (
    <Sidebar>
      <SidebarTopRow>
        <SidebarHeading>Your pets</SidebarHeading>
        <IconButton type="button" onClick={onOpenCreatePet} title="Add pet">
          <FiPlus />
        </IconButton>
      </SidebarTopRow>

      <PetsList>
        {petsLoading ? (
          <Muted>Loading pets...</Muted>
        ) : pets.length === 0 ? (
          <SidebarEmpty>
            <SidebarEmptyTitle>No pets yet</SidebarEmptyTitle>
            <SidebarEmptyText>
              Create a pet profile to start organizing records.
            </SidebarEmptyText>
            <SidebarPrimary type="button" onClick={onOpenCreatePet}>
              <FiPlus />
              Create your first pet
            </SidebarPrimary>
          </SidebarEmpty>
        ) : (
          pets.map((p) => (
            <PetLink key={p.id} to={`/app/pets/${p.id}/records`}>
              {({ isActive }) => (
                <PetRow as="div" $active={isActive}>
                  <PetAvatar
                    $active={isActive}
                    $photo={p.photoURL || ""}
                    aria-label={p.displayName || "Pet"}
                  >
                    {!p.photoURL
                      ? (p.displayName || "P").charAt(0).toUpperCase()
                      : null}
                  </PetAvatar>
                  <PetInfo>
                    <PetName>{p.displayName || "Pet"}</PetName>
                    <PetMeta>{(p.type || p.species || "").toString()}</PetMeta>
                  </PetInfo>
                  <Chevron>
                    <FiChevronRight />
                  </Chevron>
                </PetRow>
              )}
            </PetLink>
          ))
        )}
      </PetsList>

      <SidebarFooter>
        <FooterLink type="button" onClick={onOpenHow}>
          <FiInfo />
          How it works
        </FooterLink>
        <FooterLink type="button" onClick={onGoSupport}>
          Support
        </FooterLink>
      </SidebarFooter>
    </Sidebar>
  );
});

function MainPanel({
  uid,
  pets,
  hasPets,
  onOpenCreatePet,
  onOpenHow,
  onRequestEditPet,
  savedPetState,
  onOpenPassportEdit, // NEW
}) {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [activePet, setActivePet] = useState(null);
  const [activePetLoading, setActivePetLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!petId) {
        setActivePet(null);
        return;
      }

      setActivePetLoading(true);
      try {
        const ref = doc(firestore, "pets", petId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setActivePet(null);
          return;
        }

        const data = { ...snap.data(), id: snap.id };

        if (uid && data.owner && data.owner !== uid) {
          setActivePet(null);
          return;
        }

        setActivePet(data);
      } catch (e) {
        console.error("Active pet error:", e);
        setActivePet(null);
      } finally {
        setActivePetLoading(false);
      }
    };

    load();
  }, [petId, uid]);

  useEffect(() => {
    if (!savedPetState?.pet?.id) return;
    if (savedPetState.mode !== "edit") return;
    if (savedPetState.pet.id !== petId) return;
    setActivePet(savedPetState.pet);
  }, [petId, savedPetState]);

  const dobDate = activePet?.dob?.toDate ? activePet.dob.toDate() : null;

  const ageStr = useMemo(() => {
    if (!dobDate) return "";
    const now = DateTime.now();
    const dob = DateTime.fromJSDate(dobDate);

    const years = Math.floor(now.diff(dob, "years").years);
    if (years >= 2) return `${years} yrs`;

    const months = Math.floor(now.diff(dob, "months").months);
    if (months >= 2) return `${months} mos`;

    const days = Math.max(0, Math.floor(now.diff(dob, "days").days));
    return `${days} days`;
  }, [dobDate]);

  const petName = activePet?.displayName || "Pet";
  const species = (activePet?.type || activePet?.species || "PET").toString();

  const handlePrimary = useCallback(() => {
    if (!hasPets) {
      onOpenCreatePet();
      return;
    }

    const first = pets[0]?.id;
    if (first) navigate(`/app/pets/${first}/records`);
  }, [hasPets, navigate, onOpenCreatePet, pets]);

  const handleEditPet = useCallback(() => {
    if (!activePet) return;
    onRequestEditPet(activePet);
  }, [activePet, onRequestEditPet]);

  return (
    <Main>
      {!hasPets ? (
        <EmptyState>
          <EmptyHeader>
            <EmptyTitle>Universal Medical Record</EmptyTitle>
            <EmptySubtitle>
              Keep your pet’s records in one place. Share with any vet in
              seconds.
            </EmptySubtitle>
          </EmptyHeader>

          <EmptyCard>
            <EmptyCardInner>
              <EmptyCardTitle>Get started in 1 minute</EmptyCardTitle>

              <StepRow>
                <StepIcon $bg="#60a5fa">
                  <span>🐾</span>
                </StepIcon>
                <StepText>
                  <StepTitle>Create your pet profile</StepTitle>
                  <StepDesc>Add name, species, and basic info.</StepDesc>
                </StepText>
              </StepRow>

              <StepRow>
                <StepIcon $bg="#2563eb">
                  <FiUpload />
                </StepIcon>
                <StepText>
                  <StepTitle>Upload records</StepTitle>
                  <StepDesc>PDFs, images, exports, anything you have.</StepDesc>
                </StepText>
              </StepRow>

              <StepRow>
                <StepIcon $bg="#f59e0b">
                  <FiShare2 />
                </StepIcon>
                <StepText>
                  <StepTitle>Share with your vet</StepTitle>
                  <StepDesc>Send a secure link to request uploads.</StepDesc>
                </StepText>
              </StepRow>

              <PrimaryCtaRow>
                <PrimaryButton type="button" onClick={handlePrimary}>
                  <FiPlus />
                  Create Your First Pet
                </PrimaryButton>

                <SecondaryButton type="button" onClick={onOpenHow}>
                  How it works
                </SecondaryButton>
              </PrimaryCtaRow>

              <PrivacyNote>
                <FiShield />
                You control access. You decide who can view and upload records.
              </PrivacyNote>
            </EmptyCardInner>
          </EmptyCard>
        </EmptyState>
      ) : !petId ? (
        <WelcomeCard>
          <WelcomeTitle>Welcome</WelcomeTitle>
          <WelcomeText>
            Choose a pet to upload PDFs, photos, labs, and invoices. Then share
            a secure link with any vet.
          </WelcomeText>
        </WelcomeCard>
      ) : !activePet && !activePetLoading ? (
        <WelcomeCard>
          <WelcomeTitle>Pet not found</WelcomeTitle>
          <WelcomeText>
            This pet may have been removed or you do not have access.
          </WelcomeText>
        </WelcomeCard>
      ) : (
        <>
          <HeaderCard>
            <HeaderLeft>
              <HeaderTopRow>
                <HeaderAvatar $photo={activePet?.photoURL || ""}>
                  {!activePet?.photoURL
                    ? (petName || "P").charAt(0).toUpperCase()
                    : null}
                </HeaderAvatar>

                <div>
                  <HeaderTitle>{petName}</HeaderTitle>
                  <HeaderSub>
                    {species.toUpperCase()}
                    {ageStr ? ` · ${ageStr}` : ""}
                  </HeaderSub>
                </div>
              </HeaderTopRow>

              <ChipsRow>
                {!!activePet?.categoryBreed?.label && (
                  <ChipPill title={activePet.categoryBreed.label}>
                    {activePet.categoryBreed.label}
                  </ChipPill>
                )}
                {!!activePet?.categoryColor?.label && (
                  <ChipPill title={activePet.categoryColor.label}>
                    {activePet.categoryColor.label}
                  </ChipPill>
                )}
                {!!activePet?.petSex && <ChipPill>{activePet.petSex}</ChipPill>}
                {typeof activePet?.isFixed === "boolean" && (
                  <ChipPill>
                    {activePet.isFixed ? "Fixed" : "Not fixed"}
                  </ChipPill>
                )}
              </ChipsRow>
            </HeaderLeft>

            <HeaderRight>
              <HeaderAction type="button" onClick={handleEditPet}>
                <FiSettings />
                Edit pet
              </HeaderAction>
            </HeaderRight>
          </HeaderCard>

          <TabsRow>
            <TabLink to={`/app/pets/${petId}/records`}>
              <FiFolder /> Records
            </TabLink>

            <TabLink to={`/app/pets/${petId}/passport`}>
              <FiCreditCard /> Passport
            </TabLink>
            <TabLink to={`/app/pets/${petId}/vaccines`}>
              <FiCreditCard /> Vaccines
            </TabLink>
            <TabLink to={`/app/pets/${petId}/vetreadysummary`}>
              <FiShare2 /> Vet-Ready Summary
            </TabLink>
          </TabsRow>

          <Content>
            <Outlet context={{ pet: activePet, uid, onOpenPassportEdit }} />
          </Content>
        </>
      )}
    </Main>
  );
}

function PetHealthLayout() {
  const { userData } = useContext(GlobalContext);
  const firebaseUser = auth.currentUser;
  const uid = firebaseUser?.uid || userData?.uid || null;
  const { pets, loading: petsLoading } = useGetUserPets(uid);
  const hasPets = pets.length > 0;

  const navigate = useNavigate();

  const [howOpen, setHowOpen] = useState(false);

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [petEditorConfig, setPetEditorConfig] = useState(null);
  const [savedPetState, setSavedPetState] = useState(null);
  const profileMenuRef = useRef(null);
  const [passportEditorConfig, setPassportEditorConfig] = useState(null);

  const openPassportEdit = useCallback((pet) => {
    if (!pet?.id) return;
    setPassportEditorConfig({ petId: pet.id, pet });
  }, []);

  const closePassportEdit = useCallback(() => {
    setPassportEditorConfig(null);
  }, []);

  const userPhoto =
    firebaseUser?.photoURL || userData?.photoURL || userData?.avatarUrl || "";

  const userLabel =
    firebaseUser?.displayName ||
    userData?.displayName ||
    userData?.name ||
    firebaseUser?.email ||
    userData?.email ||
    "Account";

  const userEmail = firebaseUser?.email || userData?.email || "";

  const openCreatePet = useCallback(() => {
    setPetEditorConfig({ mode: "create", pet: null });
  }, []);

  const requestEditPet = useCallback((pet) => {
    if (!pet) return;
    setPetEditorConfig({ mode: "edit", pet });
  }, []);

  const openHowModal = useCallback(() => {
    setHowOpen(true);
  }, []);

  const closeHowModal = useCallback(() => {
    setHowOpen(false);
  }, []);

  const goHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const goSupport = useCallback(() => {
    navigate("/support/");
  }, [navigate]);

  const toggleProfileMenu = useCallback(() => {
    setShowProfileMenu((value) => !value);
  }, []);

  const handlePetSaved = useCallback(
    (savedPet, mode) => {
      setPetEditorConfig(null);
      setSavedPetState(savedPet ? { pet: savedPet, mode } : null);

      if (savedPet && savedPet.id) {
        if (mode === "create") {
          navigate(`/app/pets/${savedPet.id}/records`);
        }
      }
    },
    [navigate],
  );

  const handleLogoutClick = useCallback(async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error signing out:", err);
    } finally {
      setShowProfileMenu(false);
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (!showProfileMenu) return;

    const onMouseDown = (e) => {
      if (!profileMenuRef.current) return;
      if (!profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };

    const onKeyDown = (e) => {
      if (e.key === "Escape") setShowProfileMenu(false);
    };

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showProfileMenu]);

  return (
    <Page>
      <LayoutBrandBar
        uid={uid}
        userLabel={userLabel}
        userEmail={userEmail}
        userPhoto={userPhoto}
        showProfileMenu={showProfileMenu}
        profileMenuRef={profileMenuRef}
        onGoHome={goHome}
        onOpenHow={openHowModal}
        onGoSupport={goSupport}
        onToggleProfileMenu={toggleProfileMenu}
        onLogout={handleLogoutClick}
      />

      <Shell>
        <LayoutSidebar
          pets={pets}
          petsLoading={petsLoading}
          onOpenCreatePet={openCreatePet}
          onOpenHow={openHowModal}
          onGoSupport={goSupport}
        />
        <MainPanel
          uid={uid}
          pets={pets}
          hasPets={hasPets}
          onOpenCreatePet={openCreatePet}
          onOpenHow={openHowModal}
          onRequestEditPet={requestEditPet}
          savedPetState={savedPetState}
          onOpenPassportEdit={openPassportEdit} // NEW
        />

        {howOpen && (
          <ModalBackdrop onClick={closeHowModal}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>How the Medical Record works</ModalTitle>
                <ModalClose type="button" onClick={closeHowModal}>
                  <FiX />
                </ModalClose>
              </ModalHeader>

              <ModalSub>
                Keep your pet’s records in one place. Share with any vet in
                seconds.
              </ModalSub>

              <ModalBody>
                <HowStep>
                  <HowIcon $bg="#60a5fa">
                    <span>🐾</span>
                  </HowIcon>
                  <HowText>
                    <HowTitle>Create your pet profile</HowTitle>
                    <HowDesc>
                      Add basic info so everything stays organized.
                    </HowDesc>
                  </HowText>
                </HowStep>

                <HowStep>
                  <HowIcon $bg="#2563eb">
                    <FiUpload />
                  </HowIcon>
                  <HowText>
                    <HowTitle>Upload records</HowTitle>
                    <HowDesc>PDFs, images, exports, anything you have.</HowDesc>
                  </HowText>
                </HowStep>

                <HowStep>
                  <HowIcon $bg="#f59e0b">
                    <FiShare2 />
                  </HowIcon>
                  <HowText>
                    <HowTitle>Share with your vet</HowTitle>
                    <HowDesc>
                      Send a secure link to request uploads or share history.
                    </HowDesc>
                  </HowText>
                </HowStep>

                <MiniCard>
                  <MiniCardTitle>Privacy and control</MiniCardTitle>
                  <MiniBullet>
                    • You control who can view and upload.
                  </MiniBullet>
                  <MiniBullet>• Share links can expire.</MiniBullet>
                  <MiniBullet>• You can revoke access anytime.</MiniBullet>
                  <MiniBullet>• Every access can be logged.</MiniBullet>
                </MiniCard>

                <MiniCard>
                  <MiniCardTitle>What to upload first</MiniCardTitle>
                  <MiniBullet>• Vaccine records</MiniBullet>
                  <MiniBullet>• Most recent invoice</MiniBullet>
                  <MiniBullet>• Recent lab results</MiniBullet>
                  <MiniBullet>• Current medications</MiniBullet>
                </MiniCard>

                <ModalCtaRow>
                  <PrimaryButton
                    type="button"
                    onClick={() => {
                      if (!hasPets) {
                        openCreatePet();
                        return;
                      }

                      const first = pets[0]?.id;
                      if (first) navigate(`/app/pets/${first}/records`);
                    }}
                  >
                    {hasPets ? (
                      <>
                        <FiFolder />
                        Go to Records
                      </>
                    ) : (
                      <>
                        <FiPlus />
                        Create Your First Pet
                      </>
                    )}
                  </PrimaryButton>
                </ModalCtaRow>
              </ModalBody>
            </ModalCard>
          </ModalBackdrop>
        )}

        {petEditorConfig && (
          <PetEditorModal
            mode={petEditorConfig.mode}
            initialPet={petEditorConfig.pet}
            uid={uid}
            onClose={() => setPetEditorConfig(null)}
            onSaved={(savedPet) =>
              handlePetSaved(savedPet, petEditorConfig.mode)
            }
          />
        )}
        {passportEditorConfig && (
          <PassportEditModal
            uid={uid}
            petId={passportEditorConfig.petId}
            pet={passportEditorConfig.pet}
            userData={userData}
            onClose={closePassportEdit}
          />
        )}
      </Shell>
    </Page>
  );
}

const MemoizedPetHealthLayout = React.memo(PetHealthLayout);

export default MemoizedPetHealthLayout;

LayoutBrandBar.propTypes = {
  uid: PropTypes.string,
  userLabel: PropTypes.string,
  userEmail: PropTypes.string,
  userPhoto: PropTypes.string,
  showProfileMenu: PropTypes.bool.isRequired,
  profileMenuRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
  onGoHome: PropTypes.func.isRequired,
  onOpenHow: PropTypes.func.isRequired,
  onGoSupport: PropTypes.func.isRequired,
  onToggleProfileMenu: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
};

LayoutSidebar.propTypes = {
  pets: PropTypes.arrayOf(petSummaryShape).isRequired,
  petsLoading: PropTypes.bool.isRequired,
  onOpenCreatePet: PropTypes.func.isRequired,
  onOpenHow: PropTypes.func.isRequired,
  onGoSupport: PropTypes.func.isRequired,
};

MainPanel.propTypes = {
  uid: PropTypes.string,
  pets: PropTypes.arrayOf(petSummaryShape).isRequired,
  hasPets: PropTypes.bool.isRequired,
  onOpenCreatePet: PropTypes.func.isRequired,
  onOpenHow: PropTypes.func.isRequired,
  onRequestEditPet: PropTypes.func.isRequired,
  onOpenPassportEdit: PropTypes.func.isRequired, // NEW
  savedPetState: PropTypes.shape({
    mode: PropTypes.string,
    pet: petSummaryShape,
  }),
};

/* styled-components */

/* UPDATED: move gradient background off Shell since Page now owns it */
const Shell = styled.div`
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  flex: 1;
  min-height: 0; /* allow children to manage their own scroll */
  overflow: hidden; /* prevent the whole window from scrolling */
`;
const Sidebar = styled.aside`
  border-right: 1px solid rgba(148, 163, 184, 0.25);
  padding: 12px 12px 16px;
  display: flex;
  flex-direction: column;
  min-width: 0;

  /* key bits for independent scrolling */
  overflow-y: auto;
  overflow-x: hidden;
`;

const SidebarTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px;
`;

const SidebarHeading = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const IconButton = styled.button`
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: #ffffff;
  border-radius: 10px;
  padding: 8px 10px;
  cursor: pointer;
  color: #0f172a;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f8fafc;
  }
`;

const PetsList = styled.div`
  margin-top: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const PetLink = styled(NavLink)`
  text-decoration: none;
`;

const PetRow = styled.button`
  width: 100%;
  border: 1px solid
    ${(p) =>
      p.$active ? "rgba(37, 99, 235, 0.35)" : "rgba(148, 163, 184, 0.22)"};
  background: ${(p) => (p.$active ? "rgba(239, 246, 255, 1)" : "#ffffff")};
  border-radius: 14px;
  padding: 10px 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  text-align: left;

  &:hover {
    background: ${(p) => (p.$active ? "rgba(239, 246, 255, 1)" : "#f8fafc")};
  }
`;

const PetAvatar = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 12px;

  background: ${(p) => (p.$active ? "#2563eb" : "#e5e7eb")};
  color: ${(p) => (p.$active ? "#ffffff" : "#334155")};

  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;

  ${(p) =>
    p.$photo
      ? `
    background-image: url("${p.$photo}");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    color: transparent;
  `
      : ""}

  box-shadow: ${(p) =>
    p.$active ? "0 10px 24px rgba(15, 23, 42, 0.08)" : "none"};
`;

const PetInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const PetName = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const PetMeta = styled.div`
  margin-top: 2px;
  font-size: 12px;
  color: #64748b;
`;

const Chevron = styled.div`
  color: #94a3b8;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const SidebarFooter = styled.div`
  margin-top: 14px;
  padding: 6px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const FooterLink = styled.button`
  border: none;
  background: transparent;
  color: #1d4ed8;
  font-size: 13px;
  cursor: pointer;
  padding: 6px 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    text-decoration: underline;
  }
`;

const Muted = styled.div`
  font-size: 13px;
  color: #64748b;
  padding: 8px 6px;
`;

const SidebarEmpty = styled.div`
  border: 1px dashed rgba(148, 163, 184, 0.55);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.7);
  padding: 14px;
`;

const SidebarEmptyTitle = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: #0f172a;
`;

const SidebarEmptyText = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
`;

const SidebarPrimary = styled.button`
  margin-top: 10px;
  border: none;
  background: #2563eb;
  color: #ffffff;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #1d4ed8;
  }
`;

const Main = styled.main`
  min-width: 0;
  display: flex;
  flex-direction: column;
  padding: 16px 20px 24px;
  overflow: hidden; /* prevent the whole page from scrolling */
`;

const HeaderCard = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 18px;
  padding: 14px 14px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const HeaderLeft = styled.div``;

const HeaderTitle = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: #0f172a;
`;

const HeaderSub = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
  letter-spacing: 0.04em;
`;

const HeaderRight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const HeaderAction = styled.button`
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: #ffffff;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #f8fafc;
  }
`;

const TabsRow = styled.nav`
  margin-top: 12px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const TabLink = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 10px;
  border-radius: 12px;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(255, 255, 255, 0.88);
  color: #0f172a;
  font-size: 13px;
  text-decoration: none;

  &.active {
    border-color: rgba(37, 99, 235, 0.35);
    background: rgba(239, 246, 255, 1);
    color: #1d4ed8;
  }
`;

const Content = styled.div`
  flex: 1;
  min-height: 0;
  margin-top: 16px;

  /* this is the scrollable area for the pet sub-pages */
  overflow-y: auto;
  overflow-x: hidden;
`;

const WelcomeCard = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 18px;
  padding: 18px;
`;

const WelcomeTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
`;

const WelcomeText = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
`;

/* Empty state like RN */

const EmptyState = styled.div`
  max-width: 820px;
`;

const EmptyHeader = styled.div`
  padding: 6px 2px 10px;
`;

const EmptyTitle = styled.div`
  font-size: 24px;
  font-weight: 900;
  color: #0f172a;
`;

const EmptySubtitle = styled.div`
  margin-top: 6px;
  font-size: 14px;
  color: #64748b;
  line-height: 1.5;
`;

const EmptyCard = styled.div`
  margin-top: 14px;
  border-radius: 16px;
  background: rgba(239, 246, 255, 0.85);
  border: 1px solid rgba(148, 163, 184, 0.22);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
`;

const EmptyCardInner = styled.div`
  padding: 16px;
`;

const EmptyCardTitle = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: #0f172a;
`;

const StepRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 12px;
`;

const StepIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: ${(p) => p.$bg || "#e5e7eb"};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;

  svg {
    font-size: 16px;
  }
`;

const StepText = styled.div`
  flex: 1;
  padding-top: 2px;
`;

const StepTitle = styled.div`
  font-size: 15px;
  font-weight: 900;
  color: #0f172a;
`;

const StepDesc = styled.div`
  margin-top: 4px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
`;

const PrimaryCtaRow = styled.div`
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const PrimaryButton = styled.button`
  border: none;
  background: #2563eb;
  color: #ffffff;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background: #1d4ed8;
  }
`;

const SecondaryButton = styled.button`
  border: none;
  background: transparent;
  color: #1d4ed8;
  border-radius: 12px;
  padding: 10px 8px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;

  &:hover {
    text-decoration: underline;
  }
`;

const PrivacyNote = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #64748b;
  line-height: 1.4;
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

/* Modal */

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  background: rgba(15, 23, 42, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
  overflow: auto;
`;

const ModalHeader = styled.div`
  padding: 14px 16px 10px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const ModalTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
`;

const ModalClose = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 6px;
  border-radius: 999px;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f1f5f9;
  }

  svg {
    font-size: 18px;
  }
`;

const ModalSub = styled.div`
  padding: 10px 16px 0;
  font-size: 13px;
  color: #64748b;
`;

const ModalBody = styled.div`
  padding: 12px 16px 16px;
`;

const HowStep = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 10px 0;
`;

const HowIcon = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 14px;
  background: ${(p) => p.$bg || "#e5e7eb"};
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;

  svg {
    font-size: 16px;
  }
`;

const HowText = styled.div`
  flex: 1;
`;

const HowTitle = styled.div`
  font-size: 14px;
  font-weight: 900;
  color: #0f172a;
`;

const HowDesc = styled.div`
  margin-top: 4px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.4;
`;

const MiniCard = styled.div`
  margin-top: 12px;
  padding: 12px;
  border-radius: 14px;
  background: rgba(239, 246, 255, 0.6);
  border: 1px solid rgba(148, 163, 184, 0.22);
`;

const MiniCardTitle = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 8px;
`;

const MiniBullet = styled.div`
  font-size: 13px;
  color: #0f172a;
  margin-bottom: 6px;
`;

const ModalCtaRow = styled.div`
  margin-top: 14px;
`;

const HeaderTopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HeaderAvatar = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 16px;
  background: #e5e7eb;
  color: #334155;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;

  ${(p) =>
    p.$photo
      ? `
    background-image: url("${p.$photo}");
    background-size: cover;
    background-position: center;
    color: transparent;
  `
      : ""}
`;

const ChipsRow = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ChipPill = styled.div`
  max-width: 100%;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
  color: #0f172a;
  background: rgba(239, 246, 255, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.22);

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

/* NEW */
const Page = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;

  color: #e5e7eb;
`;

/* NEW */
const BrandBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 40;
  background: rgba(255, 255, 255, 0.92);
  border-bottom: 1px solid rgba(148, 163, 184, 0.22);
  backdrop-filter: saturate(140%) blur(8px);
`;

/* NEW */
const BrandBarInner = styled.div`
  width: 100%;
  padding: 14px 19px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

/* NEW */
const BrandBarLeft = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;

  &:hover {
    opacity: 0.95;
  }
`;

/* NEW */
const BrandBarTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
`;

/* NEW */
const BrandBarSub = styled.div`
  margin-top: 3px;
  font-size: 12px;
  color: #64748b;
`;

/* NEW */
const BrandBarRight = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

/* NEW */
const BrandBarLink = styled.button`
  border: none;
  background: transparent;
  color: #1d4ed8;
  font-size: 13px;
  cursor: pointer;
  padding: 6px 0;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  &:hover {
    text-decoration: underline;
  }
`;

const BrandMark = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const BrandLogo = styled.img`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  object-fit: cover;
  display: block;
`;

const BrandTextStack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.05;
`;

const ProfileShell = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const UserAvatarButton = styled.button`
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  background: #ffffff;
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: #f8fafc;
  }
`;

const UserAvatarImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const UserAvatarInitials = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: #0f172a;
`;

const ProfileMenu = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 260px;
  border-radius: 14px;
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.22);
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
  overflow: hidden;
  z-index: 60;
`;

const ProfileMenuHeader = styled.div`
  padding: 12px 12px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  color: #0f172a;

  svg {
    margin-top: 2px;
    color: #64748b;
  }
`;

const ProfileMenuHeaderText = styled.div`
  min-width: 0;
  flex: 1;
`;

const ProfileName = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: #0f172a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProfileEmail = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProfileMenuDivider = styled.div`
  height: 1px;
  background: #e5e7eb;
`;

const ProfileMenuItem = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  padding: 10px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #0f172a;
  font-size: 13px;
  font-weight: 800;
  text-align: left;

  &:hover {
    background: #f8fafc;
  }

  svg {
    color: #64748b;
  }
`;
