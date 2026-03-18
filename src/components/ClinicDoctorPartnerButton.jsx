import React, { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { doc, onSnapshot } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import GlobalContext from "../context/GlobalContext";
import { firestore } from "../lib/firebase";
import checkRole from "../utility/checkRole";
import checkUserBRole from "../utility/checkUserBRole";
import usePartnerActions from "../hooks/usePartnerActions";
import { getHospitalPrereqsStatus } from "../utility/telemedChecklist";

const FIELD_LABELS = {
  firstName: "First name",
  lastName: "Last name",
  phoneNumber: "Phone number",
  address: "Address",
  hospitalEula: "Hospital/Org Agreement (EULA)",
};

function bullets(keys = []) {
  return keys.map((k) => `• ${FIELD_LABELS[k] || k}`).join("\n");
}

export default function ClinicDoctorPartnerButton({ userBData }) {
  const { userData } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [partnerInfo, setPartnerInfo] = useState(null);

  const role = checkRole();
  const userBRole = checkUserBRole(userBData);

  const refs = useMemo(() => {
    let RefInitiator = null;
    let RefReceiver = null;
    let RefInitiatorParent = null;
    let RefReceiverParent = null;

    if (role === "Doctor" && userBRole === "Organization") {
      RefInitiator = doc(
        firestore,
        "doctors",
        userData.uid,
        "doctor_partnerClinics",
        userBData.clinicId,
      );
      RefInitiatorParent = doc(firestore, "doctors", userData.uid);

      RefReceiver = doc(
        firestore,
        "clinics",
        userBData.clinicId,
        "clinic_partnerDoctors",
        userData.uid,
      );
      RefReceiverParent = doc(firestore, "clinics", userBData.clinicId);
    } else if (role === "Organization" && userBRole === "Doctor") {
      RefInitiator = doc(
        firestore,
        "clinics",
        userData.clinicId,
        "clinic_partnerDoctors",
        userBData.uid,
      );
      RefInitiatorParent = doc(firestore, "clinics", userData.clinicId);

      RefReceiver = doc(
        firestore,
        "doctors",
        userBData.uid,
        "doctor_partnerClinics",
        userData.clinicId,
      );
      RefReceiverParent = doc(firestore, "doctors", userBData.uid);
    }

    return {
      RefInitiator,
      RefReceiver,
      RefInitiatorParent,
      RefReceiverParent,
    };
  }, [role, userBRole, userData, userBData]);

  const {
    onRequestPartner,
    onUnRequestPartner,
    onConfirmPartner,
    onEndPartner,
    onDeclinePartner,
  } = usePartnerActions({
    userData,
    userBData,
    ...refs,
  });

  useEffect(() => {
    if (!refs.RefInitiator) {
      setPartnerInfo(null);
      return;
    }

    const unsub = onSnapshot(refs.RefInitiator, (snap) => {
      if (snap.exists()) {
        setPartnerInfo(snap.data() || null);
      } else {
        setPartnerInfo(null);
      }
    });

    return () => unsub();
  }, [refs.RefInitiator]);

  const shouldShowPartnerButton = useMemo(() => {
    if (!(userData?.clinicId || userBData?.clinicId)) return false;

    const validRolesCombinations = new Set([
      "Doctor:Organization",
      "Organization:Doctor",
    ]);

    return validRolesCombinations.has(`${role}:${userBRole}`);
  }, [role, userBRole, userData, userBData]);

  const showConfirm = (message, onConfirm) => {
    const ok = window.confirm(message);
    if (ok) onConfirm();
  };

  const handlePress = async (e) => {
    e.stopPropagation();

    // if (role === "Organization") {
    //   const status = getHospitalPrereqsStatus(userData, role);

    //   if (!status.isComplete) {
    //     if (status.requiredMissing.includes("hospitalEula")) {
    //       const ok = window.confirm(
    //         "Please read and accept the Hospital/Organization Agreement (EULA) before proceeding.\n\nGo there now?",
    //       );
    //       if (ok) {
    //         navigate("/app/telehealth/eula/hospital");
    //       }
    //       return;
    //     }

    //     const ok = window.confirm(
    //       `Please finish the following before proceeding:\n\n${bullets(
    //         status.requiredMissing,
    //       )}\n\nGo to your legal information now?`,
    //     );

    //     if (ok) {
    //       navigate("/app/telehealth/profile");
    //     }
    //     return;
    //   }
    // }

    if (partnerInfo?.status == null) {
      showConfirm(
        `Are you sure you want to send ${userBData.displayName} a partnership request?`,
        () => {
          onRequestPartner();
        },
      );
      return;
    }

    if (
      partnerInfo?.status === "pending" &&
      partnerInfo?.initiator !== userData?.uid
    ) {
      const approve = window.confirm(
        "Do you want to confirm this partnership?\n\nPress OK to confirm.\nPress Cancel to leave it unchanged.",
      );

      if (approve) {
        onConfirmPartner();
      } else {
        const decline = window.confirm(
          "Do you want to decline this partnership request?",
        );
        if (decline) {
          onDeclinePartner();
        }
      }
      return;
    }

    if (
      partnerInfo?.status === "pending" &&
      partnerInfo?.initiator === userData?.uid
    ) {
      showConfirm(
        "Are you sure you want to withdraw this partnership request?",
        () => {
          onUnRequestPartner();
        },
      );
      return;
    }

    if (partnerInfo?.status === "approved") {
      showConfirm("Are you sure you want to end this partnership?", () => {
        onEndPartner();
      });
    }
  };

  if (!shouldShowPartnerButton) {
    return null;
  }

  const label =
    partnerInfo?.status === "pending"
      ? "Partnering..."
      : partnerInfo?.status === "approved"
        ? "Partnered"
        : "Partner?";

  return (
    <ButtonShell>
      <PartnerBtn
        type="button"
        onClick={handlePress}
        $outlined={partnerInfo?.status != null}
        $pending={partnerInfo?.status === "pending"}
      >
        {label}
      </PartnerBtn>
    </ButtonShell>
  );
}

const ButtonShell = styled.div`
  width: 110px;
`;

const PartnerBtn = styled.button`
  width: 100%;
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 12px;
  font-weight: 800;
  cursor: pointer;
  transition: 0.15s ease;
  opacity: ${(p) => (p.$pending ? 0.6 : 1)};

  border: 1px solid
    ${(p) => (p.$outlined ? "rgba(37, 99, 235, 0.35)" : "transparent")};

  background: ${(p) => (p.$outlined ? "#ffffff" : "rgba(37, 99, 235, 1)")};

  color: ${(p) => (p.$outlined ? "#1d4ed8" : "#ffffff")};

  &:hover {
    filter: brightness(0.98);
  }
`;
