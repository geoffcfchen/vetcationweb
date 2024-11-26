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

  const userFollowingRef = userData
    ? doc(firestore, "following", userData.uid)
    : null;
  const userBFollowersRef = doc(firestore, "followers", userBDataUID);
  const userBThatUserFollowingRef = userData
    ? doc(
        collection(firestore, "following", userData.uid, "userFollowing"),
        userBDataUID
      )
    : null;
  const FollowersOfUserBRef = userData
    ? doc(
        collection(firestore, "followers", userBDataUID, "userFollower"),
        userData.uid
      )
    : null;

  async function onFollow() {
    if (!userData) {
      console.warn("User data is missing; cannot perform follow action.");
      return;
    }

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

      if (userBThatUserFollowingRef && FollowersOfUserBRef) {
        batch.set(userBThatUserFollowingRef, {
          timestamp: serverTimestamp(),
          notificationId,
        });
        batch.set(FollowersOfUserBRef, {
          timestamp: serverTimestamp(),
          notificationId,
        });
      }

      await batch.commit();
    } catch (error) {
      console.error("Error following user:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onUnFollow() {
    if (!userData) {
      console.warn("User data is missing; cannot perform unfollow action.");
      return;
    }

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

      if (userBThatUserFollowingRef && FollowersOfUserBRef) {
        batch.delete(userBThatUserFollowingRef);
        batch.delete(FollowersOfUserBRef);
      }

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
