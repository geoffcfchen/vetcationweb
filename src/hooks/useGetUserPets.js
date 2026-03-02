// src/hooks/useGetUserPets.js
import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  limit,
} from "firebase/firestore";
import { firestore } from "../lib/firebase";

export function useGetUserPets(userUID) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(!!userUID);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userUID) {
      setPets([]);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const q = query(
      collection(firestore, "pets"),
      where("owner", "==", userUID)
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setPets(list);
        setLoading(false);
      },
      (err) => {
        console.error("useGetUserPets snapshot error:", err);
        setPets([]);
        setLoading(false);
        setError(err);
      }
    );

    return () => unsub();
  }, [userUID]);

  return { pets, loading, error };
}
