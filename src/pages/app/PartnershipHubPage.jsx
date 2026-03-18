import React, { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useSearchParams } from "react-router-dom";
import { FiUsers, FiClock, FiCheckCircle, FiLoader } from "react-icons/fi";

import GlobalContext from "../../context/GlobalContext";
import usePartnershipClinicHub from "../../hooks/usePartnershipClinicHub";
import usePartnershipDoctorHub from "../../hooks/usePartnershipDoctorHub";
import ListUser from "../../components/ListUser/ListUser";

function normalizeTab(param, openTabName) {
  const value = String(param || "")
    .trim()
    .toLowerCase();

  if (!value) return openTabName;
  if (value === "open") return openTabName;
  if (value === "pending") return "Pending";
  if (value === "partnered" || value === "approved") return "Partnered";

  return openTabName;
}

function MembersList({
  members,
  isLoading,
  emptyText,
  canSeeMore = false,
  canAskClinicDoctor = false,
}) {
  if (isLoading && (!members || members.length === 0)) {
    return (
      <Center>
        <SpinnerWrap>
          <FiLoader />
        </SpinnerWrap>
        <CenterText>Loading…</CenterText>
      </Center>
    );
  }

  if (!isLoading && (!members || members.length === 0)) {
    return (
      <Center>
        <CenterText>{emptyText}</CenterText>
      </Center>
    );
  }

  return (
    <ListShell>
      {members.map((item, index) => (
        <ListUser
          key={item.id || item.uid || item.clinicId || index}
          user={item}
          canFollow={false}
          canAskQuestion={true}
          canAskClinicDoctor={canAskClinicDoctor}
          canSeeMore={canSeeMore}
          hasBorderBottomline={index !== members.length - 1}
          canNavigate={false}
        />
      ))}
    </ListShell>
  );
}

export default function PartnershipHubPage() {
  const { userData } = useContext(GlobalContext);

  const roleLabel = userData?.role?.label || "";
  const roleReady = !!roleLabel;
  const isClinic = roleLabel === "Organization";

  const clinicHub = usePartnershipClinicHub(userData, {
    enabled: roleReady && isClinic,
  });

  const doctorHub = usePartnershipDoctorHub(userData, {
    enabled: roleReady && !isClinic,
  });

  const data = isClinic ? clinicHub : doctorHub;

  const {
    cfg,
    openToPartnership,
    handleToggle,
    openList,
    pending,
    approved,
    loadingOpen,
    loadingPartners,
  } = data;

  const [searchParams, setSearchParams] = useSearchParams();

  const tabNames = useMemo(() => {
    const openName = cfg?.openTabName || "Open";
    return [openName, "Pending", "Partnered"];
  }, [cfg?.openTabName]);

  const initialTab = useMemo(() => {
    return normalizeTab(searchParams.get("tab"), cfg?.openTabName || "Open");
  }, [searchParams, cfg?.openTabName]);

  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  if (!roleReady) {
    return (
      <Center>
        <SpinnerWrap>
          <FiLoader />
        </SpinnerWrap>
        <CenterText>Loading partnership hub…</CenterText>
      </Center>
    );
  }

  const ChipIcon = cfg.chipIcon;
  const openTabName = cfg.openTabName;

  const handleTabClick = (nextTab) => {
    setActiveTab(nextTab);

    const alias =
      nextTab === openTabName
        ? "open"
        : nextTab === "Pending"
          ? "pending"
          : "partnered";

    setSearchParams({ tab: alias });
  };

  return (
    <Screen>
      <Header>
        <Title>{cfg.title}</Title>
        <Subtitle>{cfg.subtitle}</Subtitle>

        <HeaderCard>
          <CardTopRow>
            <CardTextWrap>
              <CardTitle>Open to new partnerships</CardTitle>
              <CardHint>{cfg.cardHint}</CardHint>
            </CardTextWrap>

            <SwitchWrap>
              <input
                type="checkbox"
                checked={!!openToPartnership}
                onChange={(e) => handleToggle(e.target.checked)}
              />
              <span />
            </SwitchWrap>
          </CardTopRow>

          <CardFooterRow>
            <Chip>
              <ChipIcon />
              <span>{cfg.chipLabel}</span>
            </Chip>
          </CardFooterRow>
        </HeaderCard>
      </Header>

      <TabsBar>
        {tabNames.map((tabName) => (
          <TabButton
            key={tabName}
            type="button"
            $active={activeTab === tabName}
            onClick={() => handleTabClick(tabName)}
          >
            {tabName === openTabName ? (
              <FiUsers />
            ) : tabName === "Pending" ? (
              <FiClock />
            ) : (
              <FiCheckCircle />
            )}
            <span>{tabName}</span>
          </TabButton>
        ))}
      </TabsBar>

      <TabContent>
        {activeTab === openTabName && (
          <MembersList
            members={openList}
            isLoading={loadingOpen}
            emptyText={cfg.emptyOpen}
            canSeeMore={isClinic}
            canAskClinicDoctor={true}
          />
        )}

        {activeTab === "Pending" && (
          <MembersList
            members={pending}
            isLoading={loadingPartners}
            emptyText={cfg.emptyPending}
            canSeeMore={isClinic}
            canAskClinicDoctor={true}
          />
        )}

        {activeTab === "Partnered" && (
          <MembersList
            members={approved}
            isLoading={loadingPartners}
            emptyText={cfg.emptyPartnered}
            canSeeMore={isClinic}
            canAskClinicDoctor={true}
          />
        )}
      </TabContent>
    </Screen>
  );
}

/* styled-components */

const Screen = styled.div`
  background: #f3f4f6;
  border-radius: 18px;
  padding: 16px;
`;

const Header = styled.div`
  padding-bottom: 8px;
`;

const Title = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #111827;
`;

const Subtitle = styled.div`
  margin-top: 4px;
  font-size: 14px;
  color: #6b7280;
`;

const HeaderCard = styled.div`
  margin-top: 16px;
  padding: 16px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
  border: 1px solid rgba(148, 163, 184, 0.18);
`;

const CardTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
`;

const CardTextWrap = styled.div`
  flex: 1;
`;

const CardTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
`;

const CardHint = styled.div`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.45;
`;

const CardFooterRow = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Chip = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  background: #eef2ff;
  color: #111827;
  font-size: 12px;
  font-weight: 500;

  svg {
    font-size: 16px;
  }
`;

const SwitchWrap = styled.label`
  position: relative;
  width: 50px;
  height: 30px;
  display: inline-block;
  flex: 0 0 auto;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    inset: 0;
    cursor: pointer;
    background: #d0d4dc;
    border-radius: 999px;
    transition: 0.2s;
  }

  span:before {
    content: "";
    position: absolute;
    height: 24px;
    width: 24px;
    left: 3px;
    top: 3px;
    background: #ffffff;
    border-radius: 999px;
    transition: 0.2s;
    box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12);
  }

  input:checked + span {
    background: #16a34a;
  }

  input:checked + span:before {
    transform: translateX(20px);
  }
`;

const TabsBar = styled.div`
  margin-top: 12px;
  display: flex;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e5e7eb;
  overflow-x: auto;
`;

const TabButton = styled.button`
  border: 1px solid
    ${(p) => (p.$active ? "rgba(17,24,39,0.12)" : "transparent")};
  background: ${(p) => (p.$active ? "#ffffff" : "transparent")};
  color: ${(p) => (p.$active ? "#111827" : "#6b7280")};
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: ${(p) => (p.$active ? 600 : 500)};
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &:hover {
    background: ${(p) => (p.$active ? "#ffffff" : "rgba(255,255,255,0.65)")};
  }
`;

const TabContent = styled.div`
  padding-top: 12px;
`;

const ListShell = styled.div`
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 16px;
  overflow: hidden;
`;

const Center = styled.div`
  padding: 24px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #6b7280;
`;

const SpinnerWrap = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 20px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const CenterText = styled.div`
  margin-top: 10px;
  font-size: 13px;
`;
