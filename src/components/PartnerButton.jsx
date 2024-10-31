// src/components/PartnerButton.jsx
import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import GlobalContext from "../context/GlobalContext";
import { getFirestore, doc, collection, onSnapshot } from "firebase/firestore";
import { Button } from "react-bootstrap"; // Assuming react-bootstrap is used for button styling
import checkRole from "../utility/checkRole";
import checkUserBRole from "../utility/checkUserBRole";
import usePartnerActions from "../hooks/usePartnerActions";

const firestore = getFirestore();

function PartnerButton({ userBData }) {
  const [partnerInfo, setPartnerInfo] = useState(null);
  const { userData } = useContext(GlobalContext);
  const role = checkRole();
  const userBRole = checkUserBRole(userBData);

  let RefInitiator, RefReceiver, RefInitiatorParent, RefReceiverParent;

  if (role === "Doctor" && userBRole === "LicensedTech") {
    RefInitiator = doc(
      collection(
        firestore,
        "doctors",
        userData.uid,
        "doctor_partnerLicensedTechs"
      ),
      userBData.uid
    );
    RefInitiatorParent = doc(firestore, "doctors", userData.uid);

    RefReceiver = doc(
      collection(
        firestore,
        "licensedTechs",
        userBData.uid,
        "licensedTech_partnerDoctors"
      ),
      userData.uid
    );
    RefReceiverParent = doc(firestore, "licensedTechs", userBData.uid);
  } else if (role === "LicensedTech" && userBRole === "Doctor") {
    RefInitiator = doc(
      collection(
        firestore,
        "licensedTechs",
        userData.uid,
        "licensedTech_partnerDoctors"
      ),
      userBData.uid
    );
    RefInitiatorParent = doc(firestore, "licensedTechs", userData.uid);

    RefReceiver = doc(
      collection(
        firestore,
        "doctors",
        userBData.uid,
        "doctor_partnerLicensedTechs"
      ),
      userData.uid
    );
    RefReceiverParent = doc(firestore, "doctors", userBData.uid);
  }

  const {
    onRequestPartner,
    onUnRequestPartner,
    onConfirmPartner,
    onEndPartner,
    onDeclinePartner,
  } = usePartnerActions({
    userData,
    userBData,
    RefInitiator,
    RefReceiver,
    RefInitiatorParent,
    RefReceiverParent,
  });

  useEffect(() => {
    if (!RefInitiator) return;

    const unsubscribe = onSnapshot(RefInitiator, (snapshot) => {
      const data = snapshot.data();
      setPartnerInfo(data || null);
    });

    return () => unsubscribe();
  }, [RefInitiator]);

  function showConfirmationDialog(message, onConfirm) {
    if (window.confirm(message)) {
      onConfirm();
    }
  }

  function handlePress() {
    if (partnerInfo?.status === null || partnerInfo === null) {
      showConfirmationDialog(
        `Are you sure you want to send ${userBData.displayName} a partnership request?`,
        () => {
          console.log("Partnership request sent");
          onRequestPartner();
        }
      );
    } else if (
      partnerInfo?.status === "pending" &&
      partnerInfo?.initiator !== userData?.uid
    ) {
      if (window.confirm("Do you want to confirm this partnership?")) {
        console.log("Partnership confirmed");
        onConfirmPartner();
      } else {
        console.log("Partnership declined");
        onDeclinePartner();
      }
    } else if (
      partnerInfo?.status === "pending" &&
      partnerInfo?.initiator === userData?.uid
    ) {
      showConfirmationDialog(
        "Are you sure you want to withdraw this partnership request?",
        () => {
          console.log("Partnership request cancelled");
          onUnRequestPartner();
        }
      );
    } else if (partnerInfo?.status === "approved") {
      showConfirmationDialog(
        "Are you sure you want to end this partnership?",
        () => {
          console.log("Partnership ended");
          onEndPartner();
        }
      );
    }
  }

  const shouldShowPartnerButton = (role, userBRole) => {
    const validRolesCombinations = new Set([
      "Doctor:LicensedTech",
      "LicensedTech:Doctor",
    ]);
    return validRolesCombinations.has(`${role}:${userBRole}`);
  };

  if (shouldShowPartnerButton(role, userBRole)) {
    return (
      <Container>
        <StyledButton
          variant={
            partnerInfo?.status == null ? "primary" : "outline-secondary"
          }
          onClick={handlePress}
        >
          {partnerInfo?.status === "pending"
            ? "Partnering..."
            : partnerInfo?.status === "approved"
            ? "Partnered"
            : "Partner?"}
        </StyledButton>
      </Container>
    );
  } else {
    return null;
  }
}

export default PartnerButton;

// Styled Components
const Container = styled.div`
  width: 110px;
  margin: 5px 0;
`;

const StyledButton = styled(Button)`
  width: 100%;
  font-weight: bold;
`;
