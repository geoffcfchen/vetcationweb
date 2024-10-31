// src/hooks/useGetSingleClinic.js
import { useState, useEffect } from "react";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";

function useGetSingleClinic(clinicId) {
  const [clinicData, setClinicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const firestore = getFirestore();

  useEffect(() => {
    if (!clinicId) {
      setError("No clinic ID provided");
      setLoading(false);
      return;
    }

    const clinicRef = doc(firestore, "clinics", clinicId);

    const unsubscribe = onSnapshot(
      clinicRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setClinicData(docSnapshot.data());
        } else {
          setError("No such clinic!");
        }
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [clinicId, firestore]);

  return { clinicData, loading, error };
}

export default useGetSingleClinic;
