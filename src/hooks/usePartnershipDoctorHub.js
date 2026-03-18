import { useCallback, useEffect, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { FiActivity } from "react-icons/fi";
import { firestore } from "../lib/firebase";

const cfg = {
  title: "Partner Clinics",
  subtitle: "Find and manage clinics you partner with.",
  chipIcon: FiActivity,
  chipLabel: "Doctor account",
  cardHint:
    "When this is on, clinics that match your preferences can find you.",
  openTabName: "Open Clinics",
  emptyOpen: "No open clinics found.",
  emptyPending: "No pending clinics found.",
  emptyPartnered: "No partnered clinics found.",
};

function chunk10(ids) {
  const out = [];
  for (let i = 0; i < ids.length; i += 10) {
    out.push(ids.slice(i, i + 10));
  }
  return out;
}

function dedupeByClinicId(rows) {
  const byClinicId = new Map();

  rows.forEach((row) => {
    const clinicId = row?.clinicId;
    if (!clinicId) return;

    const existing = byClinicId.get(clinicId);

    if (!existing) {
      byClinicId.set(clinicId, row);
      return;
    }

    const isOrg = row?.role?.label === "Organization";
    const existingIsOrg = existing?.role?.label === "Organization";

    if (isOrg && !existingIsOrg) {
      byClinicId.set(clinicId, row);
    }
  });

  return Array.from(byClinicId.values());
}

export default function usePartnershipDoctorHub(userData, opts = {}) {
  const enabled = opts.enabled !== false;

  const uid = userData?.uid || userData?.id || null;

  const [openToPartnership, setOpenToPartnership] = useState(
    !!userData?.isOpenToPartnership,
  );

  const [approved, setApproved] = useState([]);
  const [pending, setPending] = useState([]);
  const [loadingPartners, setLoadingPartners] = useState(true);

  const [openList, setOpenList] = useState([]);
  const [loadingOpen, setLoadingOpen] = useState(true);

  useEffect(() => {
    setOpenToPartnership(!!userData?.isOpenToPartnership);
  }, [userData?.isOpenToPartnership]);

  const handleToggle = useCallback(
    async (value) => {
      if (!uid) return;

      const prev = openToPartnership;
      setOpenToPartnership(value);

      try {
        await setDoc(
          doc(firestore, "customers", uid),
          {
            isOpenToPartnership: value,
            partnershipUpdatedAt: Date.now(),
          },
          { merge: true },
        );
      } catch (e) {
        console.error("toggle failed", e);
        alert("Update failed. Please try again.");
        setOpenToPartnership(prev);
      }
    },
    [uid, openToPartnership],
  );

  useEffect(() => {
    if (!enabled) {
      setApproved([]);
      setPending([]);
      setLoadingPartners(false);
      return;
    }

    let cancelled = false;

    if (!uid) {
      setApproved([]);
      setPending([]);
      setLoadingPartners(false);
      return;
    }

    setLoadingPartners(true);

    const ref = collection(firestore, "doctors", uid, "doctor_partnerClinics");

    const unsub = onSnapshot(
      ref,
      async (snap) => {
        if (cancelled) return;

        const byClinicId = {};
        snap.forEach((d) => {
          const s = d.data()?.status ?? null;
          if (s === "approved" || s === "pending") {
            byClinicId[d.id] = s;
          }
        });

        const clinicIds = Object.keys(byClinicId);

        if (clinicIds.length === 0) {
          setApproved([]);
          setPending([]);
          setLoadingPartners(false);
          return;
        }

        try {
          const chunks = chunk10(clinicIds);
          const results = await Promise.all(
            chunks.map((chunk) =>
              getDocs(
                query(
                  collection(firestore, "customers"),
                  where("clinicId", "in", chunk),
                ),
              ),
            ),
          );

          if (cancelled) return;

          const ownersRaw = results.flatMap((qSnap) =>
            qSnap.docs.map((d) => ({
              ...d.data(),
              id: d.id,
            })),
          );

          const owners = dedupeByClinicId(ownersRaw);

          const nextA = [];
          const nextP = [];

          owners.forEach((row) => {
            const s = byClinicId[row.clinicId];
            if (s === "approved") nextA.push(row);
            if (s === "pending") nextP.push(row);
          });

          setApproved(nextA);
          setPending(nextP);
        } catch (err) {
          console.error("partner clinics fetch error", err);
          setApproved([]);
          setPending([]);
        } finally {
          if (!cancelled) {
            setLoadingPartners(false);
          }
        }
      },
      (err) => {
        if (!cancelled) {
          console.error("partner clinics sub error", err);
          setApproved([]);
          setPending([]);
          setLoadingPartners(false);
        }
      },
    );

    return () => {
      cancelled = true;
      unsub();
    };
  }, [enabled, uid]);

  useEffect(() => {
    if (!enabled) {
      setOpenList([]);
      setLoadingOpen(false);
      return;
    }

    let cancelled = false;
    setLoadingOpen(true);

    const q = query(
      collection(firestore, "customers"),
      where("role.label", "==", "Organization"),
      where("isOpenToPartnership", "==", true),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        if (cancelled) return;

        const rowsRaw = snap.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        }));

        const rows = dedupeByClinicId(rowsRaw);

        setOpenList(rows);
        setLoadingOpen(false);
      },
      (err) => {
        if (!cancelled) {
          console.error("open clinics sub error", err);
          setOpenList([]);
          setLoadingOpen(false);
        }
      },
    );

    return () => {
      cancelled = true;
      unsub();
    };
  }, [enabled]);

  return {
    cfg,
    openToPartnership,
    handleToggle,
    openList,
    pending,
    approved,
    loadingOpen,
    loadingPartners,
  };
}
