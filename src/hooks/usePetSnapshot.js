// src/hooks/usePetSnapshot.js
import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../lib/firebase";

export default function usePetSnapshot(petId) {
  const [snapshotData, setSnapshotData] = useState(null);
  const [loading, setLoading] = useState(!!petId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!petId) {
      setSnapshotData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const ref = doc(firestore, "pets", petId, "snapshot", "current");

    const unsubscribe = onSnapshot(
      ref,
      (docSnap) => {
        setSnapshotData(docSnap.exists() ? docSnap.data() : null);
        setLoading(false);
      },
      (err) => {
        console.error("usePetSnapshot error:", err);
        setError(err);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [petId]);

  return { snapshotData, loading, error };
}
