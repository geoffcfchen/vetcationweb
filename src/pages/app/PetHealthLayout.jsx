// src/pages/app/PetHealthLayout.jsx
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import PropTypes from "prop-types";
import styled from "styled-components";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";

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
  FiGrid,
  FiDollarSign,
  FiVideo,
  FiAlertTriangle,
  FiBookOpen,
} from "react-icons/fi";
import { signOut } from "firebase/auth";

import GlobalContext from "../../context/GlobalContext";
import { auth, firestore } from "../../lib/firebase";
import { useGetUserPets } from "../../hooks/useGetUserPets";

import { DateTime } from "luxon";

import logo from "../../images/plain_icon_600.png";
import PetEditorModal from "../../components/PetEditorModal";
import PassportEditModal from "../../components/PassportEditModal";
import checkRole from "../../utility/checkRole";

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
  onGoWallet,
  onGoTelehealth,
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
          {/* Desktop quick links */}
          <BrandBarLinksDesktop>
            <BrandBarLink as={NavLink} to="/app/wallet">
              <FiDollarSign />
              Wallet
            </BrandBarLink>

            <BrandBarLink as={NavLink} to="/app/telehealth">
              <FiVideo />
              Telehealth
            </BrandBarLink>
          </BrandBarLinksDesktop>
          {/* NEW: mobile-only quick links */}
          <BrandBarLinksMobile>
            <BrandBarLink type="button" onClick={onOpenHow}>
              How it works
            </BrandBarLink>
            <BrandBarLink type="button" onClick={onGoSupport}>
              Support
            </BrandBarLink>
          </BrandBarLinksMobile>
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
  canSeeDashboard,
}) {
  return (
    <Sidebar>
      <SidebarSection>
        <SidebarSectionTitle>Workspace</SidebarSectionTitle>

        <SidebarNav>
          {/* <SideNavItem to="/app/profile">
            <FiUser />
            Profile
          </SideNavItem> */}

          <SideNavItem to="/app/wallet">
            <FiDollarSign />
            Wallet
          </SideNavItem>

          {/* <SideNavItem to="/app/dashboard">
            <FiGrid />
            Dashboard
          </SideNavItem> */}
          {canSeeDashboard && (
            <SideNavItem to="/app/dashboard">
              <FiGrid />
              Dashboard
            </SideNavItem>
          )}

          {/* <SideNavItem to="/app/telehealth">
            <FiVideo />
            Telehealth
          </SideNavItem> */}
        </SidebarNav>
      </SidebarSection>

      <SidebarDivider />

      <SidebarSection>
        <SidebarSectionTitle>Tools</SidebarSectionTitle>

        <SidebarNav>
          <SideNavItem to="/app/telehealth/settings">
            <FiSettings />
            Telehealth settings
          </SideNavItem>

          {/* <SideNavItem to="/app/settings">
            <FiShield />
            Settings & Privacy
          </SideNavItem> */}

          {/* <SideNavItem to="/app/tips">
            <FiBookOpen />
            Tips
          </SideNavItem>

          <SideNavItem to="/app/emergency">
            <FiAlertTriangle />
            Emergency
          </SideNavItem> */}
        </SidebarNav>
      </SidebarSection>

      <SidebarDivider />

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
  petsLoading,
  hasPets,
  onOpenCreatePet,
  onOpenHow,
  onRequestEditPet,
  savedPetState,
  onOpenPassportEdit,
  canTransferOwnership,
  onOpenTransferOwnership,
}) {
  const location = useLocation();
  const isAppRoot =
    location.pathname === "/app" || location.pathname === "/app/";
  const isPetRoute = location.pathname.startsWith("/app/pets/");

  const { petId } = useParams();
  const firstPetId = pets?.[0]?.id || null;
  const navigate = useNavigate();

  const [activePet, setActivePet] = useState(null);
  const [activePetLoading, setActivePetLoading] = useState(false);

  // Auto-select the first pet when user has pets but URL is just /app
  useEffect(() => {
    // wait until pets are loaded
    if (petsLoading) return;
    if (!isAppRoot) return;
    if (!petId && firstPetId) {
      navigate(`/app/pets/${firstPetId}/records`, { replace: true });
    }
  }, [petsLoading, isAppRoot, petId, firstPetId, navigate]);

  useEffect(() => {
    const load = async () => {
      if (!isPetRoute) {
        setActivePet(null);
        setActivePetLoading(false);
        return;
      }

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
  }, [isPetRoute, petId, uid]);

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

  if (!isPetRoute && !isAppRoot) {
    return (
      <Main>
        <Content>
          <Outlet context={{ uid }} />
        </Content>
      </Main>
    );
  }

  return (
    <Main>
      {!hasPets ? (
        <EmptyState>
          <EmptyHeader>
            <EmptyTitle>MyPet Health Record</EmptyTitle>
            <EmptySubtitle>
              Keep your pet’s history in one place. Request records from any
              clinic and share a vet-ready view in seconds.
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
                  <StepDesc>
                    One profile becomes the home for every record.
                  </StepDesc>
                </StepText>
              </StepRow>

              <StepRow>
                <StepIcon $bg="#2563eb">
                  <FiUpload />
                </StepIcon>
                <StepText>
                  <StepTitle>Upload what you have</StepTitle>
                  <StepDesc>PDFs, photos, portal exports, anything.</StepDesc>
                </StepText>
              </StepRow>

              <StepRow>
                <StepIcon $bg="#f59e0b">
                  <FiShare2 />
                </StepIcon>
                <StepText>
                  <StepTitle>Request and share with your vet</StepTitle>
                  <StepDesc>
                    Send a secure upload link to your clinic, or share a
                    view-only link before a visit.
                  </StepDesc>
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
                Owner-controlled sharing. You decide who can view and who can
                upload.
              </PrivacyNote>
            </EmptyCardInner>
          </EmptyCard>
        </EmptyState>
      ) : !petId ? null : !activePet && !activePetLoading ? (
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
              {canTransferOwnership && activePet?.id && (
                <HeaderAction
                  type="button"
                  onClick={() => onOpenTransferOwnership(activePet)}
                  title="Transfer this pet to another user"
                >
                  <FiUser />
                  Transfer ownership
                </HeaderAction>
              )}
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

function TransferOwnershipModal({ pet, onClose, onDone, uid }) {
  const [email, setEmail] = useState("");
  const [checking, setChecking] = useState(false);
  const [foundUser, setFoundUser] = useState(null);

  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [confirmTouched, setConfirmTouched] = useState(false);

  const petName = pet?.displayName || "Pet";
  const petId = pet?.id || "";

  useEffect(() => {
    let alive = true;

    const t = setTimeout(async () => {
      const cleaned = String(email || "")
        .trim()
        .toLowerCase();
      setError("");
      setFoundUser(null);

      if (cleaned.length < 5 || !cleaned.includes("@")) {
        setChecking(false);
        return;
      }

      setChecking(true);
      try {
        // Exact lookup by email in customers
        const q = query(
          collection(firestore, "customers"),
          where("email", "==", cleaned),
          where("hasCompletedProfile", "==", true),
          limit(1),
        );

        const snap = await getDocs(q);

        if (!alive) return;

        if (snap.empty) {
          setFoundUser(null);
          return;
        }

        const doc0 = snap.docs[0];
        const data = doc0.data() || {};
        const targetUid = doc0.id;

        // prevent selecting yourself
        if (targetUid === uid) {
          setFoundUser(null);
          setError("That email belongs to your own account.");
          return;
        }

        setFoundUser({
          uid: targetUid,
          email: (data.email || "").toLowerCase(),
          displayName: data.displayName || data.name || "",
          photoURL: data.photoURL || "",
        });
      } catch (e) {
        if (!alive) return;
        setFoundUser(null);
        setError("Could not look up that email. Please try again.");
      } finally {
        if (!alive) return;
        setChecking(false);
      }
    }, 200);

    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [email, uid]);

  const submit = async () => {
    setError("");

    if (!petId) return setError("Pet id is missing.");
    if (!foundUser?.email)
      return setError("Please enter an existing user email.");
    if (!confirmed) {
      setConfirmTouched(true);
      return setError("Please confirm you want to transfer ownership.");
    }
    const firebaseUser = auth.currentUser;
    if (!firebaseUser) return setError("You must be signed in.");

    setSubmitting(true);
    try {
      const token = await firebaseUser.getIdToken(true);

      const res = await fetch(
        "https://transferpetownership-dr6lirynsq-uc.a.run.app",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            petId,
            newOwnerEmail: foundUser.email,
          }),
        },
      );

      const json = await res.json().catch(() => null);
      if (!res.ok || !json?.ok) {
        const code = json?.error || `http-${res.status}`;
        if (code === "target-user-not-found")
          throw new Error("No user found with that email.");
        if (code === "not-current-owner")
          throw new Error("You are not the current owner of this pet.");
        if (code === "forbidden")
          throw new Error("You do not have permission to transfer ownership.");
        throw new Error("Transfer failed. Please try again.");
      }

      onDone?.();
      onClose?.();
    } catch (e) {
      setError(e?.message || "Transfer failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ModalBackdrop onClick={onClose}>
      <ModalCard onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Transfer ownership</ModalTitle>
          <ModalClose type="button" onClick={onClose} aria-label="Close">
            <FiX />
          </ModalClose>
        </ModalHeader>

        <ModalBody>
          <TransferHint>
            Transfer <strong>{petName}</strong> (ID: {petId}) to another user.
          </TransferHint>

          {error ? <TransferError>{error}</TransferError> : null}

          <TransferField>
            <TransferLabel>New owner email</TransferLabel>
            <TransferInput
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              autoComplete="email"
            />

            {checking ? <TransferSub>Checking…</TransferSub> : null}

            {!checking && email.trim() && !foundUser?.email && !error ? (
              <TransferSub>
                No user found yet. Make sure the email is correct.
              </TransferSub>
            ) : null}

            {foundUser?.email ? (
              <SelectedRow>
                Found:{" "}
                <strong>{foundUser.displayName || foundUser.email}</strong>
                <div style={{ color: "#64748b", fontSize: 12 }}>
                  {foundUser.email}
                </div>
              </SelectedRow>
            ) : null}
          </TransferField>

          <TransferConfirmRow $error={confirmTouched && !confirmed}>
            <TransferCheckbox
              type="checkbox"
              checked={confirmed}
              onChange={(e) => {
                setConfirmed(e.target.checked);
                setConfirmTouched(true);
              }}
              id="transferConfirm"
            />
            <TransferConfirmLabel htmlFor="transferConfirm">
              I understand this will change the pet owner.
            </TransferConfirmLabel>
          </TransferConfirmRow>

          <TransferActions>
            <SecondaryButton
              type="button"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </SecondaryButton>

            <PrimaryButton
              type="button"
              onClick={submit}
              disabled={submitting || !foundUser?.email}
            >
              {submitting ? "Transferring..." : "Transfer"}
            </PrimaryButton>
          </TransferActions>
        </ModalBody>
      </ModalCard>
    </ModalBackdrop>
  );
}

function PetHealthLayout() {
  const { userData } = useContext(GlobalContext);
  const firebaseUser = auth.currentUser;
  const uid = firebaseUser?.uid || userData?.uid || null;
  const { pets, loading: petsLoading } = useGetUserPets(uid);
  const hasPets = pets.length > 0;

  const role = checkRole();

  console.log("role", role);

  // const isOrg = role === "Organization";
  const canSeeDashboard = role === "Organization" || role === "Doctor";
  const canTransferOwnership = role === "Organization";

  const [transferModalConfig, setTransferModalConfig] = useState(null);

  const openTransferModal = useCallback((pet) => {
    if (!pet?.id) return;
    setTransferModalConfig({ pet });
  }, []);

  const closeTransferModal = useCallback(() => {
    setTransferModalConfig(null);
  }, []);

  console.log("PetHealthLayout userData?", userData);

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

  const userPhoto = userData?.photoURL || firebaseUser?.photoURL || "";

  // console.log("PetHealthLayout userPhoto ", userPhoto);

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
          canSeeDashboard={canSeeDashboard}
        />

        <MainPanel
          uid={uid}
          pets={pets}
          petsLoading={petsLoading}
          hasPets={hasPets}
          onOpenCreatePet={openCreatePet}
          onOpenHow={openHowModal}
          onRequestEditPet={requestEditPet}
          savedPetState={savedPetState}
          onOpenPassportEdit={openPassportEdit}
          canTransferOwnership={canTransferOwnership}
          onOpenTransferOwnership={openTransferModal}
        />

        {howOpen && (
          <ModalBackdrop onClick={closeHowModal}>
            <ModalCard onClick={(e) => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>How MyPet Health works</ModalTitle>
                <ModalClose type="button" onClick={closeHowModal}>
                  <FiX />
                </ModalClose>
              </ModalHeader>

              <ModalSub>
                Pull records into one timeline. Share a vet-ready view in
                seconds, especially in emergencies.
              </ModalSub>

              <ModalBody>
                <HowStep>
                  <HowIcon $bg="#60a5fa">
                    <span>🐾</span>
                  </HowIcon>
                  <HowText>
                    <HowTitle>Create your pet profile</HowTitle>
                    <HowDesc>
                      One profile becomes the home for visits, labs, imaging,
                      invoices, and meds.
                    </HowDesc>
                  </HowText>
                </HowStep>

                <HowStep>
                  <HowIcon $bg="#2563eb">
                    <FiUpload />
                  </HowIcon>
                  <HowText>
                    <HowTitle>Upload records</HowTitle>
                    <HowDesc>
                      Add PDFs, photos, portal exports, anything you already
                      have.
                    </HowDesc>
                  </HowText>
                </HowStep>

                <HowStep>
                  <HowIcon $bg="#f59e0b">
                    <FiShare2 />
                  </HowIcon>
                  <HowText>
                    <HowTitle>Request and share with your vet</HowTitle>
                    <HowDesc>
                      Send a secure upload link to your clinic, or share a
                      read-only view before an appointment.
                    </HowDesc>
                  </HowText>
                </HowStep>

                <HowStep>
                  <HowIcon $bg="#10b981">
                    <FiShare2 />
                  </HowIcon>
                  <HowText>
                    <HowTitle>Generate a vet-ready summary</HowTitle>
                    <HowDesc>
                      Turn the timeline into a concise overview so new vets can
                      get up to speed fast.
                    </HowDesc>
                  </HowText>
                </HowStep>

                <MiniCard>
                  <MiniCardTitle>Privacy and control</MiniCardTitle>
                  <MiniBullet>• You decide who can view vs upload.</MiniBullet>
                  <MiniBullet>
                    • Links can expire and can be regenerated.
                  </MiniBullet>
                  <MiniBullet>• You can revoke access anytime.</MiniBullet>
                  <MiniBullet>
                    • Access can be logged for transparency.
                  </MiniBullet>
                </MiniCard>

                <MiniCard>
                  <MiniCardTitle>What to add first</MiniCardTitle>
                  <MiniBullet>
                    • Recent visit summary or discharge instructions
                  </MiniBullet>
                  <MiniBullet>• Recent lab results</MiniBullet>
                  <MiniBullet>• Current medications</MiniBullet>
                  <MiniBullet>
                    • Recent discharge instructions (or invoices with summaries)
                  </MiniBullet>
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

        {transferModalConfig?.pet && (
          <TransferOwnershipModal
            pet={transferModalConfig.pet}
            uid={uid}
            onClose={closeTransferModal}
            onDone={() => navigate("/app", { replace: true })}
          />
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
  onGoWallet: PropTypes.func,
  onGoTelehealth: PropTypes.func,
};

LayoutSidebar.propTypes = {
  pets: PropTypes.arrayOf(petSummaryShape).isRequired,
  petsLoading: PropTypes.bool.isRequired,
  onOpenCreatePet: PropTypes.func.isRequired,
  onOpenHow: PropTypes.func.isRequired,
  onGoSupport: PropTypes.func.isRequired,
  canSeeDashboard: PropTypes.bool,
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
  petsLoading: PropTypes.bool.isRequired,
  canTransferOwnership: PropTypes.bool,
  onOpenTransferOwnership: PropTypes.func,
};

/* styled-components */

/* UPDATED: move gradient background off Shell since Page now owns it */
const Shell = styled.div`
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  flex: 1;
  min-height: 0;
  overflow: hidden; /* desktop: independent scroll for sidebar/content */

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    flex: 0 0 auto;
    min-height: auto;
    overflow: visible; /* let the whole page scroll on mobile */
  }
`;
const Sidebar = styled.aside`
  border-right: 1px solid rgba(148, 163, 184, 0.25);
  padding: 12px 12px 16px;
  display: flex;
  flex-direction: column;
  min-width: 0;

  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 768px) {
    border-right: none;
    border-bottom: 1px solid rgba(148, 163, 184, 0.25);
    padding: 10px 12px 12px;

    /* let it size to content and use page scroll instead */
    overflow-y: visible;
  }
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

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: stretch;
    overflow-x: auto;
    padding-bottom: 4px;
    margin-bottom: 4px;
  }
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

  @media (max-width: 768px) {
    min-width: 180px;
    padding: 8px 9px;
    flex: 0 0 auto;
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

  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
    border-radius: 10px;
  }
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

  @media (max-width: 768px) {
    display: none;
  }
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
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 12px 12px 20px;
    overflow: visible;
  }
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

  @media (max-width: 768px) {
    padding: 12px 10px;
    align-items: flex-start;
  }
`;

const HeaderLeft = styled.div``;

const HeaderTitle = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: #0f172a;

  @media (max-width: 768px) {
    font-size: 16px;
  }
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

  @media (max-width: 768px) {
    margin-top: 10px;
  }
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

  @media (max-width: 640px) {
    flex: 1 1 calc(50% - 8px);
    justify-content: center;
    font-size: 12px;
    padding: 8px 8px;
  }
`;

const Content = styled.div`
  flex: 1;
  min-height: 0;
  margin-top: 16px;

  overflow-y: auto;
  overflow-x: hidden;

  @media (max-width: 768px) {
    overflow-y: visible;
  }
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
  min-height: 100vh;

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

  @media (max-width: 768px) {
    padding: 10px 14px;
  }
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

  @media (max-width: 768px) {
    font-size: 15px;
  }
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

const BrandBarLinksMobile = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: inline-flex;
    align-items: center;
    gap: 10px;
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

const SidebarSection = styled.div`
  padding: 6px;
`;

const SidebarSectionTitle = styled.div`
  font-size: 12px;
  font-weight: 800;
  color: #334155;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 8px;
`;

const SidebarNav = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SideNavItem = styled(NavLink)`
  text-decoration: none;
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(255, 255, 255, 0.92);
  border-radius: 12px;
  padding: 10px 10px;
  color: #0f172a;
  font-size: 13px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  gap: 10px;

  &:hover {
    background: #f8fafc;
  }

  &.active {
    border-color: rgba(37, 99, 235, 0.35);
    background: rgba(239, 246, 255, 1);
    color: #1d4ed8;
  }

  svg {
    color: #64748b;
  }
`;

const SidebarDivider = styled.div`
  height: 1px;
  background: rgba(148, 163, 184, 0.22);
  margin: 10px 6px;
`;

const BrandBarLinksDesktop = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const TransferHint = styled.div`
  font-size: 13px;
  color: #334155;
  line-height: 1.5;
`;

const TransferError = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: #b91c1c;
`;

const TransferField = styled.div`
  margin-top: 12px;
`;

const TransferLabel = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 6px;
`;

const TransferInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  padding: 10px 10px;
  font-size: 13px;
  outline: none;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 1px #2563eb33;
  }
`;

const TransferSub = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: #64748b;
`;

const TransferConfirmRow = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid
    ${(p) => (p.$error ? "rgba(185, 28, 28, 0.7)" : "transparent")};
  background: ${(p) =>
    p.$error ? "rgba(254, 226, 226, 0.35)" : "transparent"};
`;

const TransferCheckbox = styled.input`
  width: 16px;
  height: 16px;
`;

const TransferConfirmLabel = styled.label`
  font-size: 13px;
  color: #0f172a;
`;

const TransferActions = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const TransferSearchWrap = styled.div`
  position: relative;
`;

const SearchPill = styled.div`
  position: absolute;
  right: 10px;
  top: 9px;
  font-size: 12px;
  color: #64748b;
`;

const SearchDropdown = styled.div`
  margin-top: 6px;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 12px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
  overflow: hidden;
`;

const SearchItem = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  padding: 10px 10px;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }
`;

const SearchMainRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const SearchName = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: #0f172a;
`;

const SearchEmail = styled.div`
  font-size: 12px;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SelectedRow = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: #0f172a;
`;
