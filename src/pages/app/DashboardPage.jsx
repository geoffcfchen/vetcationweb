// src/pages/app/DashboardPage.jsx
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import styled from "styled-components";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DateTime } from "luxon";
import { FiUsers, FiVideo, FiChevronDown, FiActivity } from "react-icons/fi";

import GlobalContext from "../../context/GlobalContext";
import { auth, firestore } from "../../lib/firebase";

/* ----------------------------- Dashboard Page ----------------------------- */

const TABS = [
  { id: "clients", label: "Adopters", icon: FiUsers },
  { id: "telemedicines", label: "Telehealth", icon: FiVideo },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("clients");

  return (
    <Wrap>
      <HeaderRow>
        <Title>Account Analytics</Title>
      </HeaderRow>

      <TabsRow>
        {TABS.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <TabButton
              key={t.id}
              type="button"
              $active={isActive}
              onClick={() => setActiveTab(t.id)}
            >
              <Icon />
              {t.label}
            </TabButton>
          );
        })}
      </TabsRow>

      <Panel>
        {activeTab === "clients" ? <ClientsTab /> : <TelemedicinesTab />}
      </Panel>
    </Wrap>
  );
}

/* ----------------------------- Clients Tab ----------------------------- */

const RANGE_CHIPS = ["7D", "2W", "4W", "3M", "1Y"];
const GRANULARITIES = ["Daily", "Weekly", "Monthly"];
const METRICS = ["Total adopters", "New adopters"];

function getRangeBounds(rangeKey) {
  const end = DateTime.local().endOf("day");
  let start;
  switch (rangeKey) {
    case "7D":
      start = end.minus({ days: 6 }).startOf("day");
      break;
    case "2W":
      start = end.minus({ weeks: 2 }).plus({ days: 1 }).startOf("day");
      break;
    case "4W":
      start = end.minus({ weeks: 4 }).plus({ days: 1 }).startOf("day");
      break;
    case "3M":
      start = end.minus({ months: 3 }).plus({ days: 1 }).startOf("day");
      break;
    case "1Y":
      start = end.minus({ years: 1 }).plus({ days: 1 }).startOf("day");
      break;
    default:
      start = end.minus({ days: 6 }).startOf("day");
  }
  return { start, end };
}

function alignStart(start, granularity) {
  if (granularity === "Weekly") return start.startOf("week");
  if (granularity === "Monthly") return start.startOf("month");
  return start.startOf("day");
}

function buildBuckets(start, end, granularity) {
  const buckets = [];
  let cursor = alignStart(start, granularity);

  const step =
    granularity === "Weekly"
      ? { weeks: 1 }
      : granularity === "Monthly"
        ? { months: 1 }
        : { days: 1 };

  while (cursor <= end) {
    const next = cursor.plus(step);

    const label =
      granularity === "Monthly"
        ? cursor.toFormat("LLL")
        : cursor.toFormat("MMM d");

    buckets.push({
      start: cursor,
      end: next.minus({ millisecond: 1 }),
      label,
      full:
        granularity === "Monthly"
          ? cursor.toFormat("LLLL yyyy")
          : granularity === "Weekly"
            ? `Week of ${cursor.toFormat("MMM d")}`
            : cursor.toFormat("ccc, LLL d"),
    });

    cursor = next;
  }
  return buckets;
}

function bucketize(rows, buckets) {
  const counts = new Array(buckets.length).fill(0);

  rows.forEach((row) => {
    const js = row?.linkedAt?.toDate?.() || row?.linkedAt || null;
    if (!js) return;
    const ts = DateTime.fromJSDate(js);

    for (let i = 0; i < buckets.length; i++) {
      if (ts >= buckets[i].start && ts <= buckets[i].end) {
        counts[i] += 1;
        break;
      }
    }
  });

  return counts;
}

function ClientsTab() {
  const { userData } = useContext(GlobalContext);

  const [rangeKey, setRangeKey] = useState("7D");
  const [granularity, setGranularity] = useState("Daily");
  const [metric, setMetric] = useState("Total clients");

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [total, setTotal] = useState(0);
  const [newCount, setNewCount] = useState(0);

  const [seriesNew, setSeriesNew] = useState([]);
  const [seriesTotal, setSeriesTotal] = useState([]);

  const roleLabel = userData?.role?.label || "";
  const isDoctor = roleLabel === "Doctor";
  const clinicId = isDoctor ? userData?.uid : userData?.clinicId;

  const { start, end } = useMemo(() => getRangeBounds(rangeKey), [rangeKey]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setErr("");

        if (!clinicId) {
          setTotal(0);
          setNewCount(0);
          setSeriesNew([]);
          setSeriesTotal([]);
          return;
        }

        const colRef = collection(
          firestore,
          "clinics",
          clinicId,
          "clinic_clients",
        );

        // Total clients now
        const totalSnap = await getDocs(colRef);
        if (cancelled) return;

        // Clients before range start (base for cumulative)
        const baseQ = query(colRef, where("linkedAt", "<", start.toJSDate()));
        const baseSnap = await getDocs(baseQ);
        if (cancelled) return;

        // Clients within range
        const rangeQ = query(
          colRef,
          where("linkedAt", ">=", start.toJSDate()),
          where("linkedAt", "<=", end.toJSDate()),
        );
        const rangeSnap = await getDocs(rangeQ);
        if (cancelled) return;

        const buckets = buildBuckets(start, end, granularity);
        const rows = rangeSnap.docs.map((d) => d.data());
        const counts = bucketize(rows, buckets);

        const dataNew = counts.map((v, i) => ({
          value: v,
          label: buckets[i].label,
          full: buckets[i].full,
        }));

        let running = baseSnap.size;
        const dataTotal = counts.map((v, i) => {
          running += v;
          return {
            value: running,
            label: buckets[i].label,
            full: buckets[i].full,
          };
        });

        setTotal(totalSnap.size);
        setNewCount(rangeSnap.size);
        setSeriesNew(dataNew);
        setSeriesTotal(dataTotal);
      } catch (e) {
        setErr(String(e?.message || e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [clinicId, rangeKey, granularity, start, end]);

  const displayed = metric === "Total clients" ? seriesTotal : seriesNew;

  return (
    <TabWrap>
      <TabTitleRow>
        <TabTitle>Adopters</TabTitle>
      </TabTitleRow>

      <ChipsRow>
        {RANGE_CHIPS.map((rk) => (
          <ChipButton
            key={rk}
            type="button"
            $active={rangeKey === rk}
            onClick={() => {
              setRangeKey(rk);
              if (rk === "3M") setGranularity("Weekly");
              if (rk === "1Y") setGranularity("Monthly");
              if (rk === "7D" || rk === "2W" || rk === "4W")
                setGranularity("Daily");
            }}
          >
            {rk}
          </ChipButton>
        ))}
      </ChipsRow>

      <Card>
        <CardTopRow>
          <PillSelect
            label="Metric"
            value={metric}
            onChange={setMetric}
            options={METRICS}
          />
          <PillSelect
            label="Granularity"
            value={granularity}
            onChange={setGranularity}
            options={GRANULARITIES}
          />
        </CardTopRow>

        <ChartShell>
          {loading ? (
            <Muted>Loading…</Muted>
          ) : err ? (
            <ErrorText>{err}</ErrorText>
          ) : displayed.length === 0 ? (
            <Muted>No data in this period</Muted>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={displayed}>
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                <ReTooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const p = payload[0]?.payload;
                    return (
                      <TooltipCard>
                        <TooltipTitle>{p.full}</TooltipTitle>
                        <TooltipLine>
                          {metric}: <strong>{p.value}</strong>
                        </TooltipLine>
                      </TooltipCard>
                    );
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartShell>
      </Card>

      <Grid2>
        <StatCard
          type="button"
          onClick={() => alert("Clients list page is next.")}
          disabled={loading || !!err}
        >
          <StatLabel>Total clients</StatLabel>
          <StatValue>{loading ? "…" : err ? "-" : total}</StatValue>
        </StatCard>

        <StatCard
          type="button"
          onClick={() => alert("New clients list page is next.")}
          disabled={loading || !!err}
        >
          <StatLabel>New ({rangeKey.toLowerCase()})</StatLabel>
          <StatValue>{loading ? "…" : err ? "-" : newCount}</StatValue>
        </StatCard>
      </Grid2>
    </TabWrap>
  );
}

/* -------------------------- Telemedicines Tab -------------------------- */

const OUTCOME_CATALOG = [
  { key: "resolved", label: "Resolved", color: "#22c55e" },
  { key: "prescribed_meds", label: "Prescribed meds", color: "#a855f7" },
  { key: "recheck_telemed", label: "Recheck (telemed)", color: "#7c3aed" },
  {
    key: "escalate_in_person",
    label: "Escalate to in-person",
    color: "#f59e0b",
  },
  {
    key: "refer_other_doctors",
    label: "Refer other doctors",
    color: "#0ea5e9",
  },
  { key: "er", label: "ER", color: "#ef4444" },
  { key: "monitor", label: "Monitor", color: "#6b7280" },
];

const COLORS_BY_KEY = OUTCOME_CATALOG.reduce((acc, o) => {
  acc[o.key] = o.color;
  return acc;
}, {});

function deriveAnalyticsOutcome(keys = []) {
  const priority = [
    "er",
    "escalate_in_person",
    "refer_other_doctors",
    "recheck_telemed",
    "prescribed_meds",
    "resolved",
    "monitor",
  ];
  for (const k of priority) if (keys?.includes(k)) return k;
  return "monitor";
}

function TelemedicinesTab() {
  const { userData } = useContext(GlobalContext);

  const roleLabel = userData?.role?.label || "";
  const isDoctor = roleLabel === "Doctor";
  const effectiveClinicId = isDoctor ? userData?.uid : userData?.clinicId;

  const [rangeKey, setRangeKey] = useState("7D");
  const { start, end } = useMemo(() => getRangeBounds(rangeKey), [rangeKey]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [doctors, setDoctors] = useState([]); // [{doctorId, doctorName, total, countsMap, tagCountsMap, totalSelections}]
  const [doctorOption, setDoctorOption] = useState("All doctors");

  const selectedDoctor = useMemo(() => {
    if (isDoctor) {
      return doctors.find((d) => d.doctorId === userData?.uid);
    }
    return doctors.find((d) => d.doctorName === doctorOption);
  }, [isDoctor, doctors, doctorOption, userData?.uid]);

  const combined = useMemo(() => {
    const counts = new Map(OUTCOME_CATALOG.map((o) => [o.key, 0]));
    let total = 0;

    for (const d of doctors) {
      total += d.total;
      for (const [k, v] of d.counts.entries()) {
        counts.set(k, (counts.get(k) || 0) + v);
      }
    }
    return { total, counts };
  }, [doctors]);

  const combinedTags = useMemo(() => {
    const tagCounts = new Map(OUTCOME_CATALOG.map((o) => [o.key, 0]));
    let totalSelections = 0;

    for (const d of doctors) {
      totalSelections += d.totalSelections || 0;
      for (const [k, v] of d.tagCounts.entries()) {
        tagCounts.set(k, (tagCounts.get(k) || 0) + v);
      }
    }
    return { totalSelections, tagCounts };
  }, [doctors]);

  const view =
    isDoctor || selectedDoctor
      ? {
          total: selectedDoctor?.total || 0,
          counts: selectedDoctor?.counts || new Map(),
        }
      : combined;

  const viewTags =
    isDoctor || selectedDoctor
      ? {
          totalSelections: selectedDoctor?.totalSelections || 0,
          tagCounts: selectedDoctor?.tagCounts || new Map(),
        }
      : combinedTags;

  const pieData = useMemo(() => {
    const total = view.total || 0;
    if (!total)
      return [
        { key: "placeholder", label: "No data", value: 1, color: "#f3f4f6" },
      ];

    return OUTCOME_CATALOG.map((o) => ({
      key: o.key,
      label: o.label,
      value: view.counts.get(o.key) || 0,
      color: o.color,
    })).filter((s) => s.value > 0);
  }, [view]);

  const tagBarData = useMemo(() => {
    return OUTCOME_CATALOG.map((o) => ({
      key: o.key,
      label: o.label,
      value: viewTags.tagCounts.get(o.key) || 0,
    }));
  }, [viewTags]);

  const hasTagData = (viewTags.totalSelections || 0) > 0;

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        setLoading(true);
        setErr("");

        const clinicId = effectiveClinicId;
        if (!clinicId) {
          setDoctors([]);
          setErr("Missing clinic id");
          return;
        }

        // doctorIds
        let doctorIds = [];
        if (isDoctor) {
          doctorIds = [userData?.uid].filter(Boolean);
        } else {
          const partnerRef = collection(
            firestore,
            "clinics",
            clinicId,
            "clinic_partnerDoctors",
          );
          const partnerSnap = await getDocs(partnerRef);
          doctorIds = partnerSnap.docs.map((d) => d.id).filter(Boolean);
        }

        if (!doctorIds.length) {
          setDoctors([]);
          return;
        }

        const nextDoctors = [];

        for (const doctorId of doctorIds) {
          if (cancelled) return;

          // doctor name
          let doctorName = doctorId;
          try {
            const dSnap = await getDoc(doc(firestore, "customers", doctorId));
            if (dSnap.exists()) {
              const u = dSnap.data() || {};
              doctorName = u.displayName || u.userName || doctorId;
            }
          } catch {}

          // pets with doctor assigned
          // NOTE: This can be heavy. In production, prefer pre-aggregated analytics.
          const petsQ = query(
            collection(firestore, "pets"),
            where("doctors", "array-contains", doctorId),
            limit(200),
          );
          const petsSnap = await getDocs(petsQ);
          if (cancelled) return;

          const primaryCounts = new Map(OUTCOME_CATALOG.map((o) => [o.key, 0]));
          const tagCounts = new Map(OUTCOME_CATALOG.map((o) => [o.key, 0]));

          let total = 0;
          let totalSelections = 0;

          for (const petDoc of petsSnap.docs) {
            if (cancelled) return;

            const visitsCol = collection(
              firestore,
              "pets",
              petDoc.id,
              "clinics",
              doctorId,
              "visits",
            );

            const visitsQ = query(
              visitsCol,
              where("timestamp", ">=", start.toJSDate()),
              where("timestamp", "<=", end.toJSDate()),
            );

            let visitsSnap;
            try {
              visitsSnap = await getDocs(visitsQ);
            } catch (e) {
              // missing index or no permission etc
              continue;
            }

            visitsSnap.forEach((v) => {
              const vd = v.data() || {};
              const statuses = Array.isArray(vd.statuses) ? vd.statuses : [];
              const primary =
                vd.analyticsOutcome || deriveAnalyticsOutcome(statuses);

              if (!COLORS_BY_KEY[primary]) return;

              primaryCounts.set(primary, (primaryCounts.get(primary) || 0) + 1);
              total += 1;

              statuses.forEach((s) => {
                if (!COLORS_BY_KEY[s]) return;
                tagCounts.set(s, (tagCounts.get(s) || 0) + 1);
                totalSelections += 1;
              });
            });
          }

          nextDoctors.push({
            doctorId,
            doctorName,
            total,
            counts: primaryCounts,
            tagCounts,
            totalSelections,
          });
        }

        if (!cancelled) {
          setDoctors(nextDoctors);
          if (!isDoctor && doctorOption !== "All doctors") {
            const stillExists = nextDoctors.some(
              (d) => d.doctorName === doctorOption,
            );
            if (!stillExists) setDoctorOption("All doctors");
          }
        }
      } catch (e) {
        if (!cancelled) setErr(String(e?.message || e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [effectiveClinicId, isDoctor, userData?.uid, start, end, doctorOption]);

  return (
    <TabWrap>
      <TabTitleRow>
        <TabTitle>Telehealth Outcomes</TabTitle>
      </TabTitleRow>

      <ChipsRow>
        {RANGE_CHIPS.map((rk) => (
          <ChipButton
            key={rk}
            type="button"
            $active={rangeKey === rk}
            onClick={() => setRangeKey(rk)}
          >
            {rk}
          </ChipButton>
        ))}
      </ChipsRow>

      <Card>
        <CardTopRow>
          <PillLeft>
            <FiActivity />
            <span>Telehealth outcomes</span>
          </PillLeft>

          {!isDoctor && (
            <SelectPill>
              <select
                value={doctorOption}
                onChange={(e) => setDoctorOption(e.target.value)}
              >
                <option value="All doctors">All doctors</option>
                {doctors.map((d) => (
                  <option key={d.doctorId} value={d.doctorName}>
                    {d.doctorName}
                  </option>
                ))}
              </select>
              <FiChevronDown />
            </SelectPill>
          )}
        </CardTopRow>

        {loading ? (
          <Muted>Loading…</Muted>
        ) : err ? (
          <ErrorText>{err}</ErrorText>
        ) : (
          <>
            <SectionTitle>Primary outcome distribution</SectionTitle>

            <PieGrid>
              <PieBox>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="label"
                      innerRadius={60}
                      outerRadius={92}
                      stroke="transparent"
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.key} fill={entry.color} />
                      ))}
                    </Pie>
                    <ReTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload || !payload.length) return null;
                        const p = payload[0]?.payload;
                        return (
                          <TooltipCard>
                            <TooltipTitle>{p.label}</TooltipTitle>
                            <TooltipLine>
                              Count: <strong>{p.value}</strong>
                            </TooltipLine>
                          </TooltipCard>
                        );
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>

                <CenterTotal>
                  <CenterTotalNum>{view.total || 0}</CenterTotalNum>
                  <CenterTotalSub>visits</CenterTotalSub>
                </CenterTotal>
              </PieBox>

              <LegendBox>
                {OUTCOME_CATALOG.map((o) => {
                  const count = view.counts.get(o.key) || 0;
                  const pct = view.total
                    ? Math.round((count / view.total) * 100)
                    : 0;
                  return (
                    <LegendRow key={o.key}>
                      <Swatch style={{ background: o.color }} />
                      <LegendText>
                        {o.label} — {count}
                        {view.total ? ` (${pct}%)` : ""}
                      </LegendText>
                    </LegendRow>
                  );
                })}
                <LegendNote>Total visits: {view.total || 0}</LegendNote>
                {!view.total ? <Muted>No visits in this period</Muted> : null}
              </LegendBox>
            </PieGrid>

            <Divider />

            <SectionTitle>All selected outcomes</SectionTitle>

            {!hasTagData ? (
              <Muted>No selections in this period</Muted>
            ) : (
              <>
                <ChartShell>
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={tagBarData}>
                      <XAxis
                        dataKey="label"
                        tick={{ fontSize: 11 }}
                        interval={0}
                      />
                      <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                      <ReTooltip
                        content={({ active, payload }) => {
                          if (!active || !payload || !payload.length)
                            return null;
                          const p = payload[0]?.payload;
                          return (
                            <TooltipCard>
                              <TooltipTitle>{p.label}</TooltipTitle>
                              <TooltipLine>
                                Count: <strong>{p.value}</strong>
                              </TooltipLine>
                            </TooltipCard>
                          );
                        }}
                      />
                      <Bar dataKey="value" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartShell>

                <SmallNote>
                  Total selections: {viewTags.totalSelections || 0}
                </SmallNote>
                <Muted>
                  Note: A single visit can contribute to multiple outcomes.
                </Muted>
              </>
            )}
          </>
        )}
      </Card>
    </TabWrap>
  );
}

/* ----------------------------- Shared UI ----------------------------- */

function PillSelect({ label, value, onChange, options }) {
  return (
    <SelectPill>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <FiChevronDown />
    </SelectPill>
  );
}

/* ----------------------------- styles ----------------------------- */

const Wrap = styled.div`
  max-width: 1100px;
  margin: 0 auto;
  padding: 6px 2px 22px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
`;

const Title = styled.div`
  font-size: 22px;
  font-weight: 900;
  color: #0f172a;
`;

const TabsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.75);
  border: 1px solid rgba(148, 163, 184, 0.18);
  overflow-x: auto;
`;

const TabButton = styled.button`
  border: 1px solid
    ${(p) =>
      p.$active ? "rgba(37, 99, 235, 0.35)" : "rgba(148, 163, 184, 0.22)"};
  background: ${(p) =>
    p.$active ? "rgba(239, 246, 255, 1)" : "rgba(255,255,255,0.92)"};
  color: ${(p) => (p.$active ? "#1d4ed8" : "#0f172a")};
  border-radius: 12px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 900;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  &:hover {
    background: ${(p) => (p.$active ? "rgba(239, 246, 255, 1)" : "#f8fafc")};
  }
`;

const Panel = styled.div`
  margin-top: 12px;
`;

const TabWrap = styled.div``;

const TabTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const TabTitle = styled.div`
  font-size: 16px;
  font-weight: 900;
  color: #0f172a;
`;

const ChipsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
`;

const ChipButton = styled.button`
  border: 1px solid ${(p) => (p.$active ? "rgba(29,155,240,0.65)" : "#e6e6e6")};
  background: ${(p) => (p.$active ? "#e8f4ff" : "#f1f3f5")};
  color: ${(p) => (p.$active ? "#0b63b6" : "#0f172a")};
  border-radius: 999px;
  padding: 8px 14px;
  cursor: pointer;
  font-size: 13px;
  font-weight: ${(p) => (p.$active ? 900 : 700)};

  &:hover {
    opacity: 0.95;
  }
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.06);
`;

const CardTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 10px;

  @media (max-width: 720px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const PillLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 12px;
  background: #f5f9ff;
  color: #0f172a;
  font-weight: 900;
`;

const SelectPill = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;

  select {
    appearance: none;
    border: 1px solid rgba(148, 163, 184, 0.28);
    background: rgba(255, 255, 255, 0.92);
    border-radius: 12px;
    padding: 10px 36px 10px 12px;
    font-size: 13px;
    font-weight: 900;
    color: #0f172a;
    cursor: pointer;
  }

  svg {
    position: absolute;
    right: 10px;
    pointer-events: none;
    color: #64748b;
  }
`;

const ChartShell = styled.div`
  margin-top: 8px;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 14px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.75);
`;

const Grid2 = styled.div`
  margin-top: 12px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.button`
  border: 1px solid rgba(148, 163, 184, 0.22);
  background: rgba(255, 255, 255, 0.92);
  border-radius: 14px;
  padding: 14px;
  cursor: pointer;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:hover {
    background: #f8fafc;
  }
`;

const StatLabel = styled.div`
  font-size: 13px;
  color: #64748b;
  font-weight: 800;
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 900;
  color: #0f172a;
`;

const Muted = styled.div`
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
`;

const ErrorText = styled.div`
  font-size: 13px;
  color: #b91c1c;
  line-height: 1.5;
`;

const TooltipCard = styled.div`
  background: #ffffff;
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 12px;
  padding: 10px 10px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.12);
`;

const TooltipTitle = styled.div`
  font-size: 13px;
  font-weight: 900;
  color: #0f172a;
`;

const TooltipLine = styled.div`
  margin-top: 6px;
  font-size: 13px;
  color: #475569;
`;

const SectionTitle = styled.div`
  margin-top: 10px;
  font-size: 14px;
  font-weight: 900;
  color: #0f172a;
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(148, 163, 184, 0.18);
  margin: 14px 0;
`;

const PieGrid = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 14px;
  align-items: center;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const PieBox = styled.div`
  position: relative;
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 16px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.75);
`;

const CenterTotal = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  pointer-events: none;
`;

const CenterTotalNum = styled.div`
  font-size: 18px;
  font-weight: 900;
  color: #0f172a;
`;

const CenterTotalSub = styled.div`
  margin-top: 4px;
  font-size: 12px;
  color: #64748b;
`;

const LegendBox = styled.div`
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.75);
`;

const LegendRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 0;
`;

const Swatch = styled.div`
  width: 10px;
  height: 10px;
  border-radius: 3px;
`;

const LegendText = styled.div`
  font-size: 13px;
  color: #0f172a;
`;

const LegendNote = styled.div`
  margin-top: 8px;
  font-size: 13px;
  font-weight: 900;
  color: #0f172a;
`;

const SmallNote = styled.div`
  margin-top: 8px;
  font-size: 13px;
  color: #0f172a;
  font-weight: 800;
`;
