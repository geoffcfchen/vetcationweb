// src/hooks/useFollowActions.js
import { useState } from "react";
import {
  getFirestore,
  doc,
  collection,
  writeBatch,
  serverTimestamp,
  increment,
  getDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

const firestore = getFirestore();

const useFollowActions = (userData, userBDataUID) => {
  const [isLoading, setIsLoading] = useState(false);

  const userFollowingRef = doc(firestore, "following", userData.uid);
  const userBFollowersRef = doc(firestore, "followers", userBDataUID);
  const userBThatUserFollowingRef = doc(
    collection(firestore, "following", userData.uid, "userFollowing"),
    userBDataUID
  );
  const FollowersOfUserBRef = doc(
    collection(firestore, "followers", userBDataUID, "userFollower"),
    userData.uid
  );

  async function onFollow() {
    setIsLoading(true);
    try {
      const batch = writeBatch(firestore);

      const notificationId = uuidv4();
      const { uid, photoURL, displayName } = userData;
      const userDataNameURLUID = { uid, photoURL, displayName };

      const notification = {
        type: "onFollow",
        fromUser: userDataNameURLUID,
        timestamp: serverTimestamp(),
        read: false,
      };

      const userBNotificationRef = doc(
        collection(
          firestore,
          "notifications",
          userBDataUID,
          "userNotifications"
        ),
        notificationId
      );
      batch.set(userBNotificationRef, notification);

      const userBRef = doc(firestore, "notifications", userBDataUID);
      batch.set(userBRef, { unread: increment(1) }, { merge: true });

      batch.set(userBThatUserFollowingRef, {
        timestamp: serverTimestamp(),
        notificationId,
      });
      batch.set(FollowersOfUserBRef, {
        timestamp: serverTimestamp(),
        notificationId,
      });

      await batch.commit();
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onUnFollow() {
    setIsLoading(true);
    try {
      const batch = writeBatch(firestore);

      const followersRefSnap = await getDoc(FollowersOfUserBRef);
      const oldNotificationId = followersRefSnap.data()?.notificationId;

      if (oldNotificationId) {
        const userBNotificationRef = doc(
          collection(
            firestore,
            "notifications",
            userBDataUID,
            "userNotifications"
          ),
          oldNotificationId
        );
        batch.delete(userBNotificationRef);
      }

      batch.delete(userBThatUserFollowingRef);
      batch.delete(FollowersOfUserBRef);

      await batch.commit();
    } catch (error) {
      console.error("Error unfollowing user:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return { onFollow, onUnFollow, isLoading };
};

export default useFollowActions;
