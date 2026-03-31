import { useCallback, useEffect, useState } from "react";
import {
  collection,
  doc,
  documentId,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { FiBriefcase } from "react-icons/fi";
import { firestore } from "../lib/firebase";

const cfg = {
  title: "Partnership Hub",
  subtitle: "See and manage veterinarians who partner with your organization.",
  chipIcon: FiBriefcase,
  chipLabel: "Clinic account",
  cardHint: "When this is on, vets that match your preferences can find you.",
  openTabName: "Open Vets",
  emptyOpen: "No open vets found.",
  emptyPending: "No pending vets found.",
  emptyPartnered: "No partnered vets found.",
};

function chunk10(ids) {
  const out = [];
  for (let i = 0; i < ids.length; i += 10) {
    out.push(ids.slice(i, i + 10));
  }
  return out;
}

export default function usePartnershipClinicHub(userData, opts = {}) {
  const enabled = opts.enabled !== false;

  const uid = userData?.uid || userData?.id || null;
  const clinicId = userData?.clinicId || null;

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

    if (!clinicId) {
      setApproved([]);
      setPending([]);
      setLoadingPartners(false);
      return;
    }

    setLoadingPartners(true);

    const ref = collection(
      firestore,
      "clinics",
      clinicId,
      "clinic_partnerDoctors",
    );

    const unsub = onSnapshot(
      ref,
      async (snap) => {
        if (cancelled) return;

        const byUid = {};
        snap.forEach((d) => {
          const s = d.data()?.status ?? null;
          if (s === "approved" || s === "pending") {
            byUid[d.id] = s;
          }
        });

        const allIds = Object.keys(byUid);

        if (allIds.length === 0) {
          setApproved([]);
          setPending([]);
          setLoadingPartners(false);
          return;
        }

        try {
          const chunks = chunk10(allIds);
          const results = await Promise.all(
            chunks.map((chunk) =>
              getDocs(
                query(
                  collection(firestore, "customers"),
                  where(documentId(), "in", chunk),
                ),
              ),
            ),
          );

          if (cancelled) return;

          const rows = results.flatMap((qSnap) =>
            qSnap.docs.map((d) => ({
              ...d.data(),
              id: d.id,
            })),
          );

          const nextA = [];
          const nextP = [];

          rows.forEach((row) => {
            const key = row.uid || row.id;
            const s = byUid[key];

            if (s === "approved") nextA.push(row);
            if (s === "pending") nextP.push(row);
          });

          setApproved(nextA);
          setPending(nextP);
        } catch (err) {
          console.error("partner doctors fetch error", err);
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
          console.error("partner doctors sub error", err);
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
  }, [enabled, clinicId]);

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
      where("role.label", "==", "Doctor"),
      where("isOpenToPartnership", "==", true),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        if (cancelled) return;

        const rows = snap.docs.map((d) => ({
          ...d.data(),
          id: d.id,
        }));

        setOpenList(rows);
        setLoadingOpen(false);
      },
      (err) => {
        if (!cancelled) {
          console.error("open vets sub error", err);
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
