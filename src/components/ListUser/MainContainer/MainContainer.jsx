// src/components/ListUser/MainContainer/MainContainer.jsx
import React, { useContext, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FiX,
  FiChevronDown,
  FiChevronUp,
  FiFileText,
  FiCheckCircle,
} from "react-icons/fi";
import { FaClinicMedical } from "react-icons/fa";

import FollowButton from "../../FollowButton";
import AppText from "../../AppText";
import useGetSingleClinic from "../../../hooks/useGetSingleClinic";
import checkUserBRole from "../../../utility/checkUserBRole";
import NameBadge from "../../NameBadge";
import colors from "../../../config/colors";
import checkRole from "../../../utility/checkRole";
import PartnerButton from "../../PartnerButton";
import useStatus from "../../../hooks/useStatus";
import GlobalContext from "../../../context/GlobalContext";
import ClinicDoctorPartnerButton from "../../ClinicDoctorPartnerButton";

function MainContainer({
  user,
  Follow = "Following",
  Following = "Following",
  canFollow,
  canNavigate = true,
  canAskQuestion = false,
  canAskPartner = false,
  canAskClinicDoctor = false,
  canDelete,
  onPress,
  isManagerCanDelete,
  canSeeMore = false,
}) {
  const navigate = useNavigate();
  const { userData } = useContext(GlobalContext);
  const { status } = useStatus(userData, user);
  const role = checkRole();
  const { clinicData } = useGetSingleClinic(user?.clinicId);
  const userBRole = checkUserBRole(user);

  const [expanded, setExpanded] = useState(false);

  const shouldShowVCPRButton = (roleValue, userBRoleValue) => {
    const validRolesCombinations = new Set(["Doctor:Client", "Client:Doctor"]);
    return validRolesCombinations.has(`${roleValue}:${userBRoleValue}`);
  };

  const hasDetails = useMemo(() => {
    return Boolean(
      user?.about ||
      (Array.isArray(user?.languages) && user.languages.length) ||
      (Array.isArray(user?.animalsTreated) && user.animalsTreated.length) ||
      (Array.isArray(user?.interests) && user.interests.length) ||
      (Array.isArray(user?.specialties) && user.specialties.length) ||
      (Array.isArray(user?.licenses) && user.licenses.length) ||
      (Array.isArray(user?.specialtyCerts) && user.specialtyCerts.length) ||
      (Array.isArray(user?.professionalBusinesses) &&
        user.professionalBusinesses.length),
    );
  }, [user]);

  const handleNavigation = () => {
    if (!canNavigate) return;
    navigate("/profile-info", { state: { ProfileUser: user } });
  };

  const handleAskQuestion = (e) => {
    e.stopPropagation();

    if (status === null || status === "pending") {
      navigate("/profile-info", {
        state: { ProfileUser: user, openModal: true },
      });
    } else {
      navigate("/profile-info", { state: { ProfileUser: user } });
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onPress) onPress();
  };

  const handleExpand = (e) => {
    e.stopPropagation();
    setExpanded(true);
  };

  const handleCollapse = (e) => {
    e.stopPropagation();
    setExpanded(false);
  };

  return (
    <Container onClick={handleNavigation}>
      <HeaderContainer>
        <UserInfo>
          <NameBadge userBData={user} maxLength={24} />
          {!!user?.userName && <Username>@{user.userName}</Username>}
        </UserInfo>

        <ButtonContainer onClick={(e) => e.stopPropagation()}>
          {canFollow && (
            <FollowButtonWrapper>
              <FollowButton
                userBData={user}
                Follow={Follow}
                Following={Following}
              />
            </FollowButtonWrapper>
          )}

          {canAskQuestion && shouldShowVCPRButton(role, userBRole) && (
            <AskButton
              type="button"
              $approved={status === "approved"}
              onClick={handleAskQuestion}
            >
              {status === "approved"
                ? "Connected"
                : status === "pending"
                  ? "Pending..."
                  : "Connect?"}
            </AskButton>
          )}

          {canAskPartner && (
            <AskPartnerContainer>
              <PartnerButton userBData={user} />
            </AskPartnerContainer>
          )}

          {canAskClinicDoctor && (
            <AskPartnerContainer onClick={(e) => e.stopPropagation()}>
              <ClinicDoctorPartnerButton userBData={user} />
            </AskPartnerContainer>
          )}

          {canDelete && user?.uid === userData?.uid && (
            <DeleteButton type="button" onClick={handleDelete}>
              <FiX />
            </DeleteButton>
          )}

          {isManagerCanDelete && (
            <DeleteButton type="button" onClick={handleDelete}>
              <FiX />
            </DeleteButton>
          )}
        </ButtonContainer>
      </HeaderContainer>

      {!!clinicData?.name && (
        <ClinicInfo>
          <FaClinicMedical size={14} color="grey" />
          <ClinicText>{clinicData.name}</ClinicText>
        </ClinicInfo>
      )}

      {!!user?.bio && <Bio>{user.bio}</Bio>}

      {canSeeMore && hasDetails && !expanded && (
        <SeeMoreButton type="button" onClick={handleExpand}>
          See more <FiChevronDown />
        </SeeMoreButton>
      )}

      {expanded && (
        <ExpandedCard onClick={(e) => e.stopPropagation()}>
          {!!user?.about && (
            <SectionBlock>
              <SectionTitle>About</SectionTitle>
              <SectionContent>{user.about}</SectionContent>
            </SectionBlock>
          )}

          {!!user?.languages?.length && (
            <SectionBlock>
              <SectionTitle>Languages</SectionTitle>
              <SectionContent>{user.languages.join(", ")}</SectionContent>
            </SectionBlock>
          )}

          {!!user?.animalsTreated?.length && (
            <SectionBlock>
              <SectionTitle>Species treated</SectionTitle>
              <SectionContent>{user.animalsTreated.join(", ")}</SectionContent>
            </SectionBlock>
          )}

          {!!user?.interests?.length && (
            <SectionBlock>
              <SectionTitle>Interests</SectionTitle>
              <SectionContent>{user.interests.join(", ")}</SectionContent>
            </SectionBlock>
          )}

          {!!user?.specialties?.length && (
            <SectionBlock>
              <SectionTitle>Specialize in</SectionTitle>
              <SectionContent>{user.specialties.join(", ")}</SectionContent>
            </SectionBlock>
          )}

          {!!user?.licenses?.length &&
            user?.role?.display !== "Professional" && (
              <SectionBlock>
                <SectionTitle>Licenses</SectionTitle>
                {user.licenses.map((license, idx) => (
                  <LicenseRow
                    key={`${license?.state || "license"}-${license?.abbreviation || "abbr"}-${idx}`}
                  >
                    <FiFileText size={18} color={colors.black} />
                    <LicenseText>
                      {license?.state}
                      {license?.abbreviation
                        ? ` (${license.abbreviation}, US)`
                        : ""}
                    </LicenseText>
                  </LicenseRow>
                ))}
              </SectionBlock>
            )}

          {!!user?.specialtyCerts?.length &&
            user?.role?.display !== "Professional" && (
              <SectionBlock>
                <SectionTitle>Specialist certifications</SectionTitle>
                {user.specialtyCerts.map((cert, idx) => {
                  const verified = cert?.status === "verified";
                  return (
                    <LicenseRow
                      key={`${cert?.board || "board"}-${cert?.specialty || "spec"}-${idx}`}
                    >
                      <FiCheckCircle
                        size={18}
                        color={
                          verified ? colors.success || "#16a34a" : colors.black
                        }
                      />
                      <LicenseText>
                        {cert?.specialty}
                        {cert?.board ? ` (${cert.board})` : ""}
                      </LicenseText>
                    </LicenseRow>
                  );
                })}
              </SectionBlock>
            )}

          {!!user?.professionalBusinesses?.length &&
            user?.role?.display === "Professional" && (
              <SectionBlock>
                <SectionTitle>Professional businesses</SectionTitle>
                {user.professionalBusinesses.map((biz, idx) => {
                  const label =
                    biz?.businessName ||
                    biz?.name ||
                    biz?.entityName ||
                    "Professional business";

                  return (
                    <LicenseRow key={biz?.id || idx}>
                      <FiFileText size={18} color={colors.black} />
                      <LicenseText>{label}</LicenseText>
                    </LicenseRow>
                  );
                })}
              </SectionBlock>
            )}

          <CollapseWrap>
            <SeeMoreButton type="button" onClick={handleCollapse}>
              See less <FiChevronUp />
            </SeeMoreButton>
          </CollapseWrap>
        </ExpandedCard>
      )}
    </Container>
  );
}

export default MainContainer;

const Container = styled.div`
  flex: 1;
  margin-left: 5px;
  min-width: 0;
  cursor: pointer;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const Username = styled.div`
  color: grey;
  font-size: 12px;
  margin-top: 2px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
`;

const FollowButtonWrapper = styled.div`
  margin: 0;
`;

const AskPartnerContainer = styled.div`
  margin: 0;
`;

const AskButton = styled.button`
  border: 1px solid
    ${(props) => (props.$approved ? "green" : "rgba(37, 99, 235, 0.25)")};
  background: ${(props) =>
    props.$approved ? "transparent" : "rgba(239, 246, 255, 1)"};
  color: ${(props) => (props.$approved ? "green" : "#1d4ed8")};
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  min-width: 100px;

  &:hover {
    opacity: 0.92;
  }
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: grey;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

const ClinicInfo = styled.div`
  display: inline-flex;
  align-items: center;
  margin-top: 6px;
  padding: 4px 8px;
  background-color: ${colors.lightblue};
  border-radius: 10px;
  width: fit-content;
`;

const ClinicText = styled.div`
  color: grey;
  margin-left: 6px;
  font-size: 12px;
`;

const Bio = styled.div`
  color: ${colors.black};
  margin-top: 6px;
  font-size: 13px;
  line-height: 1.45;
`;

const SeeMoreButton = styled.button`
  margin-top: 8px;
  border: none;
  background: transparent;
  color: ${colors.softdarkblue};
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

const ExpandedCard = styled.div`
  margin-top: 8px;
  background-color: #fff;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  padding: 15px;
`;

const SectionBlock = styled.div`
  margin-bottom: 20px;
`;

const SectionTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #111827;
`;

const SectionContent = styled.div`
  color: #374151;
  line-height: 1.5;
  font-size: 14px;
`;

const LicenseRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 6px;
`;

const LicenseText = styled.div`
  font-weight: 500;
  color: #111827;
  font-size: 14px;
`;

const CollapseWrap = styled.div`
  margin-top: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
