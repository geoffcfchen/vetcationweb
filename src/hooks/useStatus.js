// src/hooks/useStatus.js
import { useEffect, useState } from "react";
import { getFirestore, doc, collection, onSnapshot } from "firebase/firestore";
import checkRole from "../utility/checkRole";
import checkUserBRole from "../utility/checkUserBRole";

const firestore = getFirestore();

const useStatus = (userData, upToDateUserBData) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  const roleRole = checkUserBRole(userData);
  const userBRole = checkUserBRole(upToDateUserBData);

  useEffect(() => {
    setLoading(true);
    let RefInitiator = null;

    if (roleRole === "Doctor" && userBRole === "Client") {
      RefInitiator = doc(
        collection(firestore, "doctors", userData.uid, "doctor_clients"),
        upToDateUserBData.uid
      );
    } else if (roleRole === "Client" && userBRole === "Doctor") {
      RefInitiator = doc(
        collection(
          firestore,
          "doctors",
          upToDateUserBData.uid,
          "doctor_clients"
        ),
        userData.uid
      );
    }

    if (RefInitiator) {
      const unsubscribe = onSnapshot(
        RefInitiator,
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const petStatus =
              data.pendingPetsCount > 0
                ? "pending"
                : data.approvedPetsCount > 0
                ? "approved"
                : null;
            setStatus(petStatus);
          } else {
            setStatus(null);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching status: ", error);
          setStatus(null);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [userData, upToDateUserBData]);

  return { status, loading };
};

export default useStatus;
