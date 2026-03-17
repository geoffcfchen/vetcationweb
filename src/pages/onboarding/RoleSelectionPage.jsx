import React, { useContext, useMemo, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { FaPaw, FaHospitalAlt } from "react-icons/fa";
import { FaUserDoctor } from "react-icons/fa6";

import GlobalContext from "../../context/GlobalContext";
import { auth, firestore } from "../../lib/firebase";

const roles = {
  doctor: {
    backgroundColor: "dodgerblue",
    icon: "doctor",
    label: "Doctor",
    display: "Veterinarian",
  },
  professional: {
    backgroundColor: "dodgerblue",
    icon: "user-nurse",
    label: "Doctor",
    display: "Professional",
  },
  petOwner: {
    backgroundColor: "mediumseagreen",
    icon: "paw",
    label: "Client",
    display: "Pet Owner",
  },
  clinic: {
    backgroundColor: "red",
    icon: "hospital-building",
    label: "Clinic",
    display: "Clinic",
  },
  organization: {
    backgroundColor: "red",
    icon: "hospital-building",
    label: "Organization",
    display: "Shelter/Rescue",
  },
  tech: {
    backgroundColor: "green",
    icon: "user-nurse",
    label: "Tech",
    display: "Licensed Technician",
  },
  csr: {
    backgroundColor: "green",
    icon: "user-nurse",
    label: "Csr",
    display: "Receptionist",
  },
};

export default function RoleSelectionPage() {
  const navigate = useNavigate();
  const { userData, setUserData } = useContext(GlobalContext);

  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const uid = auth.currentUser?.uid || userData?.uid || null;

  const roleButtons = useMemo(
    () => [
      {
        role: roles.petOwner,
        icon: <FaPaw />,
        description: "The owners who take care of their pets.",
      },
      {
        role: roles.doctor,
        icon: <FaUserDoctor />,
        description: "Provide medical care to animals.",
      },
      {
        role: roles.organization,
        icon: <FaHospitalAlt />,
        description: "Shelters, rescues, and other pet-focused organizations.",
      },
    ],
    [],
  );

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("Sign out error:", e);
    } finally {
      navigate("/", { replace: true });
    }
  };

  const saveRoleToFirestore = async (role) => {
    if (!uid) throw new Error("missing-uid");

    const ref = doc(firestore, "customers", uid);

    // IMPORTANT: store the SAME role object shape as RN
    const updateData = { role };

    await updateDoc(ref, updateData);

    // keep local context in sync
    setUserData((prev) => ({ ...(prev || {}), ...updateData }));
  };

  const onSelectRole = async (role) => {
    setSubmitError("");
    setLoading(true);

    try {
      await saveRoleToFirestore(role);

      // Mirror your RN navigation:
      // Client/Doctor/Tech/Professional -> Profile
      // Organization -> ScanQRcode
      if (role.label === "Organization") {
        navigate("/onboarding/scan-qrcode", { replace: true });
        return;
      }

      navigate("/onboarding/profile", { replace: true });
    } catch (e) {
      console.error("Role selection error:", e);
      setSubmitError(
        "An error occurred while updating your profile. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <TopBar>
        <Brand onClick={() => navigate("/", { replace: true })}>
          MyPet Health
          <BrandSub>by Vetcation</BrandSub>
        </Brand>
      </TopBar>

      <Main>
        <Card>
          <Title>Please select your role</Title>
          <Subtitle>
            This helps us show the right setup steps for your account.
          </Subtitle>

          <Buttons>
            {roleButtons.map((b) => (
              <RoleButton
                key={b.role.display}
                type="button"
                disabled={loading}
                onClick={() => onSelectRole(b.role)}
              >
                <IconWrap aria-hidden="true">{b.icon}</IconWrap>
                <RoleText>
                  <RoleTitle>{b.role.display}</RoleTitle>
                  <RoleDesc>{b.description}</RoleDesc>
                </RoleText>
              </RoleButton>
            ))}
          </Buttons>

          {!!submitError && <ErrorBanner>{submitError}</ErrorBanner>}

          <FooterRow>
            <LogoutButton
              type="button"
              onClick={handleLogout}
              disabled={loading}
            >
              Log Out
            </LogoutButton>
          </FooterRow>
        </Card>
      </Main>
    </Page>
  );
}

/* styled-components */

const Page = styled.div`
  min-height: 100vh;
  background: #ffffff;
  color: #111827;
  display: flex;
  flex-direction: column;
`;

const TopBar = styled.header`
  padding: 18px 22px;
  border-bottom: 1px solid #eef2f7;
`;

const Brand = styled.button`
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  font-size: 18px;
  font-weight: 800;
  color: #0f172a;
  display: inline-flex;
  align-items: baseline;
  gap: 8px;
`;

const BrandSub = styled.span`
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px 36px;
`;

const Card = styled.div`
  width: 100%;
  max-width: 520px;
  border: 1px solid #e5e7eb;
  border-radius: 18px;
  padding: 22px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 22px;
  font-weight: 900;
  color: #0f172a;
  text-align: center;
`;

const Subtitle = styled.p`
  margin: 10px 0 0;
  font-size: 13px;
  color: #64748b;
  text-align: center;
  line-height: 1.5;
`;

const Buttons = styled.div`
  margin-top: 18px;
  display: grid;
  gap: 10px;
`;

const RoleButton = styled.button`
  width: 100%;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  background: #ffffff;
  padding: 12px 14px;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  text-align: left;

  &:hover {
    background: #f8fafc;
  }

  &:disabled {
    opacity: 0.7;
    cursor: default;
  }
`;

const IconWrap = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: #f1f5f9;
  color: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 18px;
  }
`;

const RoleText = styled.div`
  min-width: 0;
`;

const RoleTitle = styled.div`
  font-size: 15px;
  font-weight: 900;
  color: #0f172a;
`;

const RoleDesc = styled.div`
  margin-top: 2px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.35;
`;

const ErrorBanner = styled.div`
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fee2e2;
  color: #b91c1c;
  font-size: 13px;
`;

const FooterRow = styled.div`
  margin-top: 18px;
  display: flex;
  justify-content: center;
`;

const LogoutButton = styled.button`
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 13px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 10px;

  &:hover {
    background: #f1f5f9;
    color: #0f172a;
  }

  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
`;
