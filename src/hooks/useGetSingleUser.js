// src/hooks/useGetSingleUser.js
import { useState, useEffect, useRef, useCallback } from "react";
import { getFirestore, doc, onSnapshot } from "firebase/firestore";
import { firestore } from "../firebase"; // Ensure you import the Firestore instance from your Firebase config

/**
 * Hook to listen to a single user document updates.
 * @param {string} uid User ID to fetch and listen to.
 * @returns Object containing the user document, loading state.
 */
export default function useGetSingleUser(uid) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const unsubscribeRef = useRef(null);

  const listenForUserUpdates = useCallback(() => {
    if (!uid) {
      console.log("No uid provided");
      setLoading(false);
      return;
    }

    const db = getFirestore(); // Initialize Firestore
    const docRef = doc(db, "customers", uid); // Use 'doc' to get a specific document reference

    const unsubscribe = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (docSnapshot.exists()) {
          setUser({ id: docSnapshot.id, ...docSnapshot.data() });
        } else {
          console.error(`No such user with uid: ${uid}`);
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching user:", error);
        setLoading(false);
      }
    );

    unsubscribeRef.current = unsubscribe; // Store the unsubscribe function for cleanup.
  }, [uid]);

  useEffect(() => {
    listenForUserUpdates();

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current(); // Clean up the listener when the component is unmounted or uid changes.
      }
    };
  }, [listenForUserUpdates]);

  return { user, loading };
}
