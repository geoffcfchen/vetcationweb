// src/pages/app/TelehealthSettingsPage.jsx
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import {
  FiFileText,
  FiCheckSquare,
  FiUser,
  FiDollarSign,
  FiClock,
  FiMessageSquare,
  FiCalendar,
  FiPauseCircle,
  FiChevronRight,
  FiAlertCircle,
  FiInfo,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import { FaHandshake } from "react-icons/fa";

import GlobalContext from "../../context/GlobalContext";
import checkRole from "../../utility/checkRole";
import {
  getLegalItemStatus,
  getPublicProfileStatus,
  getRateStatus,
  getNoticeTimeStatus,
  getFollowUpFeeStatus,
  getFollowUpWindowStatus,
  getAvailabilityPrereqsStatus,
  getProviderEulaStatus,
  getClientEulaStatus,
  getHospitalEulaStatus,
} from "../../utility/telemedChecklist";

const DISABLED_COLOR = "#B0B0B0";

const FIELD_LABELS = {
  firstName: "First name",
  lastName: "Last name",
  phoneNumber: "Phone number",
  address: "Address",
  licenses: "License(s)",
  insurance: "Liability insurance",
  signature: "Saved signature",
  professionalBusinesses: "Professional business",
  about: "About me",
  photoURL: "Profile photo",
  animalsTreated: "Animals treated",
  languages: "Languages",
  interests: "Interests",
  specialties: "Specialties",
  rate: "Rate ($50–$320)",
  noticeTime: "Minimum notice time",
  default_split_bps: "Default split",
  followUpQuestionFee: "Follow-up fee",
  freeSubmissionPeriod: "Free follow-up window",
  providerEula: "Provider Agreement (EULA)",
  clientEula: "Client Agreement (EULA)",
  homeClinic: "Home clinic (recommended)",
  hospitalEula: "Hospital/Org Agreement (EULA)",
};

function formatList(keys = []) {
  return keys.map((k) => FIELD_LABELS[k] || k).join(", ");
}

function StatusIcon({ status }) {
  const showRed = !status.isComplete;
  const showYellow = status.isComplete && status.recommendedMissing.length > 0;
  const showGreen = status.isComplete && status.recommendedMissing.length === 0;

  if (showRed) return <FiAlertCircle color="#dc2626" size={18} />;
  if (showYellow) return <FiInfo color="#f59e0b" size={18} />;
  if (showGreen) return <FiCheckCircle color="#16a34a" size={18} />;
  return <FiInfo color="#64748b" size={18} />;
}

function RightStatusWithPopover({ status }) {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const popRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const onDown = (e) => {
      const a = anchorRef.current;
      const p = popRef.current;
      if (a && a.contains(e.target)) return;
      if (p && p.contains(e.target)) return;
      setOpen(false);
    };

    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <RightWrap>
      <StatusButton
        ref={anchorRef}
        type="button"
        aria-label="Status details"
        title="Status details"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen((v) => !v);
        }}
      >
        <StatusIcon status={status} />
      </StatusButton>

      {open && (
        <Popover ref={popRef} onClick={(e) => e.stopPropagation()}>
          {status.requiredMissing.length > 0 ? (
            <PopoverRow>
              <PopoverLabel>Missing (required)</PopoverLabel>
              <PopoverText>{formatList(status.requiredMissing)}</PopoverText>
            </PopoverRow>
          ) : (
            <PopoverRow>
              <PopoverText>All required fields complete ✅</PopoverText>
            </PopoverRow>
          )}

          {status.recommendedMissing.length > 0 && (
            <PopoverRow>
              <PopoverLabel>Recommended</PopoverLabel>
              <PopoverText>{formatList(status.recommendedMissing)}</PopoverText>
            </PopoverRow>
          )}
        </Popover>
      )}
    </RightWrap>
  );
}

export default function TelehealthSettingsPage() {
  const navigate = useNavigate();
  const { userData } = React.useContext(GlobalContext);
  const role = checkRole();

  const [appOnlyOpen, setAppOnlyOpen] = useState(false);
  const [appOnlyTitle, setAppOnlyTitle] = useState("");
  const [appOnlyDesc, setAppOnlyDesc] = useState("");
  const [appOnlyKeys, setAppOnlyKeys] = useState([]);

  const openAppOnlyModal = useCallback((title, desc, keys = []) => {
    setAppOnlyTitle(title || "Available in the mobile app");
    setAppOnlyDesc(
      desc ||
        "This setting is currently managed in the MyPet Health mobile app. Please open the app to update it.",
    );
    setAppOnlyKeys(Array.isArray(keys) ? keys : []);
    setAppOnlyOpen(true);
  }, []);

  const closeAppOnlyModal = useCallback(() => {
    setAppOnlyOpen(false);
    setAppOnlyTitle("");
    setAppOnlyDesc("");
    setAppOnlyKeys([]);
  }, []);

  const appOnlyLines = useMemo(() => {
    return (appOnlyKeys || []).map((k) => FIELD_LABELS[k] || k);
  }, [appOnlyKeys]);

  // statuses
  const legalStatus = useMemo(
    () => getLegalItemStatus(userData, role),
    [userData, role],
  );
  const publicStatus = useMemo(
    () => getPublicProfileStatus(userData, role),
    [userData, role],
  );
  const rateStatus = useMemo(
    () => getRateStatus(userData, role),
    [userData, role],
  );
  const noticeStatus = useMemo(
    () => getNoticeTimeStatus(userData, role),
    [userData, role],
  );
  const followStatus = useMemo(
    () => getFollowUpFeeStatus(userData, role),
    [userData, role],
  );
  const followWindowStatus = useMemo(
    () => getFollowUpWindowStatus(userData, role),
    [userData, role],
  );
  const availabilityStatus = useMemo(
    () => getAvailabilityPrereqsStatus(userData, role),
    [userData, role],
  );
  const providerEulaStatus = useMemo(
    () => getProviderEulaStatus(userData, role),
    [userData, role],
  );
  const clientEulaStatus = useMemo(
    () => getClientEulaStatus(userData, role),
    [userData, role],
  );
  const hospitalEulaStatus = useMemo(
    () => getHospitalEulaStatus(userData, role),
    [userData, role],
  );

  const isAvailBlocked = role === "Doctor" && !availabilityStatus.isComplete;

  // modal for missing prerequisites
  const [missingOpen, setMissingOpen] = useState(false);
  const [missingKeys, setMissingKeys] = useState([]);

  const openMissingModal = useCallback((keys) => {
    setMissingKeys(Array.isArray(keys) ? keys : []);
    setMissingOpen(true);
  }, []);

  const closeMissingModal = useCallback(() => {
    setMissingOpen(false);
    setMissingKeys([]);
  }, []);

  const missingLines = useMemo(() => {
    return (missingKeys || []).map((k) => FIELD_LABELS[k] || k);
  }, [missingKeys]);

  // routes you can wire up later
  const go = useCallback((path) => navigate(path), [navigate]);

  return (
    <Wrap>
      <Header>
        <Title>Telehealth settings</Title>
        <SubTitle>Complete setup items to enable telehealth features.</SubTitle>
      </Header>

      <List>
        {/* <Row
          onClick={() => go("/app/telehealth/profile")}
          leftIcon={<FiFileText size={18} />}
          title="Update Legal Information*"
          desc="Update your legal information for telemedicine services"
          rightNode={<RightStatusWithPopover status={legalStatus} />}
        /> */}

        {/* {role === "Client" && (
          <Row
            onClick={() => go("/app/telehealth/eula/client")}
            leftIcon={<FiCheckSquare size={18} />}
            title="Client Agreement (EULA)*"
            desc="Read and accept the client terms"
            rightNode={<RightStatusWithPopover status={clientEulaStatus} />}
          />
        )} */}

        {/* {role === "Organization" && (
          <Row
            onClick={() => go("/app/telehealth/eula/hospital")}
            leftIcon={<FiCheckSquare size={18} />}
            title="Hospital/Org Agreement (EULA)*"
            desc="Read and accept the hospital/organization terms"
            rightNode={<RightStatusWithPopover status={hospitalEulaStatus} />}
          />
        )} */}

        {/* {role === "Doctor" && (
          <Row
            onClick={() => go("/app/telehealth/public-profile")}
            leftIcon={<FiUser size={18} />}
            title="Update Public Profile*"
            desc="Update your public profile for telemedicine services"
            rightNode={<RightStatusWithPopover status={publicStatus} />}
          />
        )} */}

        {/* {role === "Doctor" && (
          <Row
            onClick={() => go("/app/telehealth/rate")}
            leftIcon={<FiDollarSign size={18} />}
            title="Set default Rate*"
            desc="Set your default rate for appointments"
            rightNode={<RightStatusWithPopover status={rateStatus} />}
          />
        )} */}

        {/* {role === "Doctor" && (
          <Row
            onClick={() => go("/app/telehealth/notice-time")}
            leftIcon={<FiClock size={18} />}
            title="Set Minimum Notice Time*"
            desc="Set your minimum notice time for appointments"
            rightNode={<RightStatusWithPopover status={noticeStatus} />}
          />
        )} */}

        {/* {role === "Doctor" && (
          <Row
            onClick={() => go("/app/telehealth/followup-fee")}
            leftIcon={<FiMessageSquare size={18} />}
            title="Set Follow-up Fee*"
            desc="Set the fee for follow-up questions after free period"
            rightNode={<RightStatusWithPopover status={followStatus} />}
          />
        )} */}

        {/* {role === "Doctor" && (
          <Row
            onClick={() => go("/app/telehealth/followup-window")}
            leftIcon={<FiMessageSquare size={18} />}
            title="Set Follow-up window*"
            desc="Set the time window for free follow-up questions after an appointment"
            rightNode={<RightStatusWithPopover status={followWindowStatus} />}
          />
        )} */}

        {/* {role === "Doctor" && (
          <Row
            onClick={() => go("/app/telehealth/eula/provider")}
            leftIcon={<FiCheckSquare size={18} />}
            title="Provider Agreement (EULA)*"
            desc="Read and accept the provider terms"
            rightNode={<RightStatusWithPopover status={providerEulaStatus} />}
          />
        )} */}

        {/* {role === "Doctor" && (
          <Row
            disabled={isAvailBlocked}
            onClick={() => {
              if (isAvailBlocked) {
                openMissingModal(availabilityStatus.requiredMissing);
                return;
              }
              go("/app/telehealth/availability");
            }}
            leftIcon={
              <FiCalendar
                size={18}
                color={isAvailBlocked ? DISABLED_COLOR : "#16a34a"}
              />
            }
            title="Regular Availability*"
            desc="Set your regular availability to accept appointments"
            rightNode={
              <FiChevronRight
                color={isAvailBlocked ? DISABLED_COLOR : "#64748b"}
              />
            }
          />
        )} */}

        <Row
          onClick={() =>
            openAppOnlyModal(
              "Update Legal Information",
              "Please update your legal information in the MyPet Health mobile app.",
            )
          }
          leftIcon={<FiFileText size={18} />}
          title="Update Legal Information*"
          desc="Update your legal information for telemedicine services"
          rightNode={<RightStatusWithPopover status={legalStatus} />}
        />
        {role === "Client" && (
          <Row
            onClick={() =>
              openAppOnlyModal(
                "Client Agreement (EULA)",
                "Please read and accept the client agreement in the MyPet Health mobile app.",
              )
            }
            leftIcon={<FiCheckSquare size={18} />}
            title="Client Agreement (EULA)*"
            desc="Read and accept the client terms"
            rightNode={<RightStatusWithPopover status={clientEulaStatus} />}
          />
        )}

        {role === "Doctor" && (
          <Row
            onClick={() =>
              openAppOnlyModal(
                "Update Public Profile",
                "Please update your public profile in the MyPet Health mobile app.",
              )
            }
            leftIcon={<FiUser size={18} />}
            title="Update Public Profile*"
            desc="Update your public profile for telemedicine services"
            rightNode={<RightStatusWithPopover status={publicStatus} />}
          />
        )}

        {role === "Doctor" && (
          <Row
            onClick={() =>
              openAppOnlyModal(
                "Set default Rate",
                "Please set your default rate in the MyPet Health mobile app.",
              )
            }
            leftIcon={<FiDollarSign size={18} />}
            title="Set default Rate*"
            desc="Set your default rate for appointments"
            rightNode={<RightStatusWithPopover status={rateStatus} />}
          />
        )}

        {role === "Doctor" && (
          <Row
            onClick={() =>
              openAppOnlyModal(
                "Set Minimum Notice Time",
                "Please set your minimum notice time in the MyPet Health mobile app.",
              )
            }
            leftIcon={<FiClock size={18} />}
            title="Set Minimum Notice Time*"
            desc="Set your minimum notice time for appointments"
            rightNode={<RightStatusWithPopover status={noticeStatus} />}
          />
        )}

        {role === "Doctor" && (
          <Row
            onClick={() =>
              openAppOnlyModal(
                "Set Follow-up Fee",
                "Please set your follow-up fee in the MyPet Health mobile app.",
              )
            }
            leftIcon={<FiMessageSquare size={18} />}
            title="Set Follow-up Fee*"
            desc="Set the fee for follow-up questions after free period"
            rightNode={<RightStatusWithPopover status={followStatus} />}
          />
        )}

        {role === "Doctor" && (
          <Row
            onClick={() =>
              openAppOnlyModal(
                "Set Follow-up window",
                "Please set your free follow-up window in the MyPet Health mobile app.",
              )
            }
            leftIcon={<FiMessageSquare size={18} />}
            title="Set Follow-up window*"
            desc="Set the time window for free follow-up questions after an appointment"
            rightNode={<RightStatusWithPopover status={followWindowStatus} />}
          />
        )}

        {role === "Doctor" && (
          <Row
            onClick={() =>
              openAppOnlyModal(
                "Provider Agreement (EULA)",
                "Please read and accept the provider agreement in the MyPet Health mobile app.",
              )
            }
            leftIcon={<FiCheckSquare size={18} />}
            title="Provider Agreement (EULA)*"
            desc="Read and accept the provider terms"
            rightNode={<RightStatusWithPopover status={providerEulaStatus} />}
          />
        )}

        {role === "Doctor" && (
          <Row
            onClick={() => {
              if (isAvailBlocked) {
                openAppOnlyModal(
                  "Regular Availability",
                  "Availability is managed in the MyPet Health mobile app. Before you set availability, complete the required setup items below.",
                  availabilityStatus.requiredMissing,
                );
                return;
              }
              openAppOnlyModal(
                "Regular Availability",
                "Please set your regular availability in the MyPet Health mobile app.",
              );
            }}
            leftIcon={
              <FiCalendar
                size={18}
                color={isAvailBlocked ? DISABLED_COLOR : "#16a34a"}
              />
            }
            title="Regular Availability*"
            desc="Set your regular availability to accept appointments"
            rightNode={
              <FiChevronRight
                color={isAvailBlocked ? DISABLED_COLOR : "#64748b"}
              />
            }
          />
        )}

        {(role === "Organization" || role === "Doctor") && (
          <Row
            disabled={isAvailBlocked}
            onClick={() => {
              if (isAvailBlocked) {
                openMissingModal(availabilityStatus.requiredMissing);
                return;
              }
              go("/app/telehealth/partnership-hub");
            }}
            leftIcon={
              <FaHandshake
                size={18}
                color={isAvailBlocked ? DISABLED_COLOR : "#16a34a"}
              />
            }
            title="Partnership Hub*"
            desc="Manage your partnership settings for telemedicine services"
            rightNode={
              <FiChevronRight
                color={isAvailBlocked ? DISABLED_COLOR : "#64748b"}
              />
            }
          />
        )}

        {/* {role === "Doctor" && (
          <Row
            onClick={() => go("/app/telehealth/pause-availability")}
            leftIcon={<FiPauseCircle size={18} color="#dc2626" />}
            title="Pause Availability"
            desc="Pause your availability to stop accepting appointments"
            rightNode={<FiChevronRight color="#64748b" />}
          />
        )} */}
        {role === "Doctor" && (
          <Row
            onClick={() =>
              openAppOnlyModal(
                "Pause Availability",
                "Please pause your availability in the MyPet Health mobile app.",
              )
            }
            leftIcon={<FiPauseCircle size={18} color="#dc2626" />}
            title="Pause Availability"
            desc="Pause your availability to stop accepting appointments"
            rightNode={<FiChevronRight color="#64748b" />}
          />
        )}
      </List>

      {missingOpen && (
        <ModalBackdrop onClick={closeMissingModal}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Finish required setup</ModalTitle>
              <ModalClose
                type="button"
                onClick={closeMissingModal}
                aria-label="Close"
              >
                <FiX />
              </ModalClose>
            </ModalHeader>

            <ModalBody>
              <ModalText>
                Please complete the following before setting availability:
              </ModalText>

              <BulletList>
                {missingLines.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </BulletList>

              <ModalFooter>
                <PrimaryBtn type="button" onClick={closeMissingModal}>
                  OK
                </PrimaryBtn>
              </ModalFooter>
            </ModalBody>
          </ModalCard>
        </ModalBackdrop>
      )}

      {appOnlyOpen && (
        <ModalBackdrop onClick={closeAppOnlyModal}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                {appOnlyTitle || "Available in the mobile app"}
              </ModalTitle>
              <ModalClose
                type="button"
                onClick={closeAppOnlyModal}
                aria-label="Close"
              >
                <FiX />
              </ModalClose>
            </ModalHeader>

            <ModalBody>
              <ModalText>{appOnlyDesc}</ModalText>

              {appOnlyLines.length > 0 && (
                <>
                  <ModalText
                    style={{ marginTop: 10, fontWeight: 900, color: "#0f172a" }}
                  >
                    Missing required items
                  </ModalText>
                  <BulletList>
                    {appOnlyLines.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </BulletList>
                </>
              )}

              <ModalFooter>
                <PrimaryBtn type="button" onClick={closeAppOnlyModal}>
                  OK
                </PrimaryBtn>
              </ModalFooter>
            </ModalBody>
          </ModalCard>
        </ModalBackdrop>
      )}
    </Wrap>
  );
}

/* ----------------------------- Row component ----------------------------- */

function Row({ onClick, leftIcon, title, desc, rightNode, disabled }) {
  return (
    <RowBtn type="button" onClick={onClick} disabled={!!disabled}>
      <Left>
        <LeftIcon aria-hidden="true">{leftIcon}</LeftIcon>
        <TextBlock>
          <RowTitle $disabled={disabled}>{title}</RowTitle>
          <RowDesc $disabled={disabled}>{desc}</RowDesc>
        </TextBlock>
      </Left>

      <Right>{rightNode}</Right>
    </RowBtn>
  );
}

/* ----------------------------- styles ----------------------------- */

const Wrap = styled.div`
  max-width: 980px;
  margin: 0 auto;
  padding: 6px 2px 22px;
`;

const Header = styled.div`
  padding: 8px 2px 12px;
`;

const Title = styled.div`
  font-size: 20px;
  font-weight: 900;
  color: #0f172a;
`;

const SubTitle = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
`;

const List = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
`;

const RowBtn = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  padding: 12px 12px;
  min-height: 80px;
  cursor: pointer;
  text-align: left;

  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  border-bottom: 1px solid rgba(224, 224, 224, 0.9);

  &:hover {
    background: #f8fafc;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    background: transparent;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
`;

const LeftIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 12px;
  background: rgba(241, 245, 249, 0.9);
  border: 1px solid rgba(148, 163, 184, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0f172a;
  flex: 0 0 auto;
`;

const TextBlock = styled.div`
  min-width: 0;
`;

const RowTitle = styled.div`
  font-weight: 900;
  color: ${(p) => (p.$disabled ? DISABLED_COLOR : "#0f172a")};
`;

const RowDesc = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: ${(p) => (p.$disabled ? DISABLED_COLOR : "#757575")};
  line-height: 1.4;
`;

const Right = styled.div`
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

const RightWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const StatusButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 6px;
  border-radius: 999px;

  &:hover {
    background: rgba(241, 245, 249, 0.9);
  }
`;

const Popover = styled.div`
  position: absolute;
  right: 0;
  top: calc(100% + 8px);
  width: 320px;
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 14px;
  padding: 10px 10px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
  z-index: 60;
`;

const PopoverRow = styled.div`
  padding: 8px 6px;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);

  &:last-child {
    border-bottom: none;
  }
`;

const PopoverLabel = styled.div`
  font-size: 12px;
  font-weight: 900;
  color: #0f172a;
`;

const PopoverText = styled.div`
  margin-top: 6px;
  font-size: 12px;
  color: #475569;
  line-height: 1.45;
`;

/* modal */

const ModalBackdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 80;
  background: rgba(15, 23, 42, 0.42);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalCard = styled.div`
  width: 100%;
  max-width: 560px;
  border-radius: 18px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.18);
  overflow: hidden;
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

  &:hover {
    background: #f1f5f9;
  }

  svg {
    font-size: 18px;
  }
`;

const ModalBody = styled.div`
  padding: 14px 16px 16px;
`;

const ModalText = styled.div`
  font-size: 13px;
  color: #475569;
  line-height: 1.5;
`;

const BulletList = styled.ul`
  margin: 10px 0 0;
  padding-left: 18px;
  color: #0f172a;

  li {
    margin: 6px 0;
    font-size: 13px;
    line-height: 1.4;
  }
`;

const ModalFooter = styled.div`
  margin-top: 14px;
  display: flex;
  justify-content: flex-end;
`;

const PrimaryBtn = styled.button`
  border: none;
  background: #2563eb;
  color: #ffffff;
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;

  &:hover {
    background: #1d4ed8;
  }
`;
