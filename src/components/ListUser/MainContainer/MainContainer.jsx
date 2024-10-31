// src/components/MainContainer.jsx
import React, { useContext, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import FollowButton from "../../FollowButton";
import AppText from "../../AppText";
import useGetSingleClinic from "../../../hooks/useGetSingleClinic";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClinicMedical } from "@fortawesome/free-solid-svg-icons";
import checkUserBRole from "../../../utility/checkUserBRole";
import NameBadge from "../../NameBadge";
import { Button } from "react-bootstrap"; // Assuming you're using react-bootstrap
import colors from "../../../config/colors";
import checkRole from "../../../utility/checkRole";
import PartnerButton from "../../PartnerButton";
import useStatus from "../../../hooks/useStatus";
import GlobalContext from "../../../context/GlobalContext";

function MainContainer({
  user,
  Follow = "Following",
  Following = "Following",
  canFollow,
  canNavigate = true,
  canAskQuestion = false,
  canAskPartner = false,
  canDelete,
  onPress,
  isManagerCanDelete,
}) {
  const navigate = useNavigate();
  const { userData } = useContext(GlobalContext);
  const { status } = useStatus(userData, user);
  const role = checkRole();
  const { clinicData } = useGetSingleClinic(user.clinicId);
  const userBRole = checkUserBRole(user);

  const shouldShowVCPRButton = (role, userBRole) => {
    const validRolesCombinations = new Set(["Doctor:Client", "Client:Doctor"]);
    return validRolesCombinations.has(`${role}:${userBRole}`);
  };

  const handleNavigation = () => {
    if (canNavigate) {
      navigate("/profile-info", { state: { ProfileUser: user } });
    }
  };

  const handleAskQuestion = () => {
    if (status === null || status === "pending") {
      navigate("/profile-info", {
        state: { ProfileUser: user, openModal: true },
      });
    } else {
      navigate("/profile-info", { state: { ProfileUser: user } });
    }
  };

  return (
    <Container onClick={handleNavigation}>
      <HeaderContainer>
        <UserInfo>
          <NameBadge userBData={user} />
          <AppText style={{ color: "grey" }}>@{user.userName}</AppText>
        </UserInfo>
        <ButtonContainer>
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
            <AskButtonContainer>
              <Button
                variant={status === "approved" ? "outline-success" : "primary"}
                onClick={handleAskQuestion}
                style={{ borderColor: status === "approved" && "green" }}
                size="sm"
              >
                {status === "approved"
                  ? "Connected"
                  : status === "pending"
                  ? "Pending..."
                  : "Connect?"}
              </Button>
            </AskButtonContainer>
          )}
          {canAskPartner && (
            <AskPartnerContainer>
              <PartnerButton userBData={user} />
            </AskPartnerContainer>
          )}
          {canDelete && user.uid === userData.uid && (
            <DeleteButton onClick={onPress}>&times;</DeleteButton>
          )}
          {isManagerCanDelete && (
            <DeleteButton onClick={onPress}>&times;</DeleteButton>
          )}
        </ButtonContainer>
      </HeaderContainer>
      {clinicData && (
        <ClinicInfo>
          <FontAwesomeIcon icon={faClinicMedical} size="sm" color="grey" />
          <AppText style={{ color: "grey" }}> {clinicData.name}</AppText>
        </ClinicInfo>
      )}
      {user.bio && <Bio>{user.bio}</Bio>}
    </Container>
  );
}

export default MainContainer;

// Styled Components
const Container = styled.div`
  flex: 1;
  margin-left: 5px;
  cursor: pointer;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FollowButtonWrapper = styled.div`
  margin: 0;
`;

const AskButtonContainer = styled.div`
  width: 110px;
`;

const AskPartnerContainer = styled.div`
  margin: 0;
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: grey;
  cursor: pointer;
  font-size: 1.2em;
  line-height: 1;
`;

const ClinicInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 5px;
  padding: 5px;
  background-color: ${colors.lightblue};
  border-radius: 10px;
`;

const Bio = styled.div`
  color: ${colors.black};
  margin-top: 5px;
`;
