// src/hooks/usePartnerActions.js
import { v4 as uuidv4 } from "uuid"; // Use uuid library for UUID generation
import {
  getFirestore,
  collection,
  doc,
  writeBatch,
  serverTimestamp,
  increment,
  getDoc,
} from "firebase/firestore";
import usePushNotification from "./usePushNotification";

const firestore = getFirestore();

function usePartnerActions({
  userData,
  userBData,
  RefInitiator,
  RefReceiver,
  RefInitiatorParent,
  RefReceiverParent,
}) {
  const { sendNotification } = usePushNotification();

  const onRequestPartner = async () => {
    try {
      const batch = writeBatch(firestore);

      const notificationId = uuidv4();
      const { uid, photoURL, displayName } = userData;
      const userDataNameURLUID = { uid, photoURL, displayName };

      const notification = {
        type: "onRequestPartner",
        fromUser: userDataNameURLUID,
        timestamp: serverTimestamp(),
        read: false,
      };

      const userBNotificationRef = doc(
        collection(
          firestore,
          "notifications",
          userBData.uid,
          "userNotifications"
        ),
        notificationId
      );
      batch.set(userBNotificationRef, notification);

      const userBRef = doc(firestore, "notifications", userBData.uid);
      batch.set(userBRef, { unread: increment(1) }, { merge: true });
      batch.set(RefInitiatorParent, {}, { merge: true });

      batch.set(RefInitiator, {
        status: "pending",
        initiator: userData.uid,
        notificationId,
        RequestTimestamp: serverTimestamp(),
      });
      batch.set(RefReceiverParent, {}, { merge: true });
      batch.set(RefReceiver, {
        status: "pending",
        initiator: userData.uid,
        RequestTimestamp: serverTimestamp(),
      });

      await batch.commit();

      const userBSnap = await getDoc(
        doc(firestore, "customers", userBData.uid)
      );
      const token = userBSnap.data()?.expoPushToken;

      sendNotification(
        token,
        "New Partnership Request",
        `You have a new partnership request from ${userData.displayName}`,
        { type: "PartnerRequest" }
      );
    } catch (error) {
      console.error("Error sending partnership request:", error);
    }
  };

  const onUnRequestPartner = async () => {
    try {
      const batch = writeBatch(firestore);

      const RefInitiatorSnap = await getDoc(RefInitiator);
      const oldNotificationId = RefInitiatorSnap.data()?.notificationId;

      if (oldNotificationId) {
        const userBNotificationRef = doc(
          collection(
            firestore,
            "notifications",
            userBData.uid,
            "userNotifications"
          ),
          oldNotificationId
        );
        batch.delete(userBNotificationRef);
      }

      batch.set(RefInitiator, { status: null }, { merge: true });
      batch.set(RefReceiver, { status: null }, { merge: true });

      await batch.commit();
    } catch (error) {
      console.error("Error canceling partnership request:", error);
    }
  };

  const onConfirmPartner = async () => {
    try {
      const batch = writeBatch(firestore);
      const notificationId = uuidv4();
      const { uid, photoURL, displayName } = userData;
      const userDataNameURLUID = { uid, photoURL, displayName };

      const notification = {
        type: "onConfirmPartner",
        fromUser: userDataNameURLUID,
        timestamp: serverTimestamp(),
        read: false,
      };

      const userBNotificationRef = doc(
        collection(
          firestore,
          "notifications",
          userBData.uid,
          "userNotifications"
        ),
        notificationId
      );
      batch.set(userBNotificationRef, notification);

      const userBRef = doc(firestore, "notifications", userBData.uid);
      batch.set(userBRef, { unread: increment(1) }, { merge: true });

      batch.update(RefInitiator, {
        status: "approved",
        confirmationTimestamp: serverTimestamp(),
        notificationId,
      });
      batch.update(RefReceiver, {
        status: "approved",
        confirmationTimestamp: serverTimestamp(),
      });

      await batch.commit();

      const userBSnap = await getDoc(
        doc(firestore, "customers", userBData.uid)
      );
      const token = userBSnap.data()?.expoPushToken;

      sendNotification(
        token,
        "Partnership Confirmed",
        `${userData.displayName} has confirmed your partnership request.`,
        { type: "PartnerRequestConfirmed" }
      );
    } catch (error) {
      console.error("Error confirming partnership:", error);
    }
  };

  const onEndPartner = async () => {
    try {
      const batch = writeBatch(firestore);
      const notificationId = uuidv4();
      const { uid, photoURL, displayName } = userData;
      const userDataNameURLUID = { uid, photoURL, displayName };

      const notification = {
        type: "onEndPartner",
        fromUser: userDataNameURLUID,
        timestamp: serverTimestamp(),
        read: false,
      };

      const userBNotificationRef = doc(
        collection(
          firestore,
          "notifications",
          userBData.uid,
          "userNotifications"
        ),
        notificationId
      );
      batch.set(userBNotificationRef, notification);

      const userBRef = doc(firestore, "notifications", userBData.uid);
      batch.set(userBRef, { unread: increment(1) }, { merge: true });

      batch.update(RefInitiator, {
        status: null,
        cancellationTimestamp: serverTimestamp(),
        initiator: null,
      });
      batch.update(RefReceiver, {
        status: null,
        cancellationTimestamp: serverTimestamp(),
        initiator: null,
      });

      await batch.commit();

      const userBSnap = await getDoc(
        doc(firestore, "customers", userBData.uid)
      );
      const token = userBSnap.data()?.expoPushToken;

      sendNotification(
        token,
        "Partnership Request Ended",
        `${userData.displayName} has ended the partnership.`,
        { type: "PartnerEnded" }
      );
    } catch (error) {
      console.error("Error ending partnership:", error);
    }
  };

  const onDeclinePartner = async () => {
    try {
      const batch = writeBatch(firestore);
      const notificationId = uuidv4();
      const { uid, photoURL, displayName } = userData;
      const userDataNameURLUID = { uid, photoURL, displayName };

      const notification = {
        type: "onDeclinePartner",
        fromUser: userDataNameURLUID,
        timestamp: serverTimestamp(),
        read: false,
      };

      const userBNotificationRef = doc(
        collection(
          firestore,
          "notifications",
          userBData.uid,
          "userNotifications"
        ),
        notificationId
      );
      batch.set(userBNotificationRef, notification);

      const userBRef = doc(firestore, "notifications", userBData.uid);
      batch.set(userBRef, { unread: increment(1) }, { merge: true });

      batch.update(RefInitiator, {
        status: null,
        declineTimestamp: serverTimestamp(),
        initiator: null,
      });
      batch.update(RefReceiver, {
        status: null,
        declineTimestamp: serverTimestamp(),
        initiator: null,
      });

      await batch.commit();

      const userBSnap = await getDoc(
        doc(firestore, "customers", userBData.uid)
      );
      const token = userBSnap.data()?.expoPushToken;

      sendNotification(
        token,
        "Partnership Request Declined",
        `${userData.displayName} has declined your partnership request.`,
        { type: "PartnerRequestDeclined" }
      );
    } catch (error) {
      console.error("Error declining partnership request:", error);
    }
  };

  return {
    onRequestPartner,
    onUnRequestPartner,
    onConfirmPartner,
    onEndPartner,
    onDeclinePartner,
  };
}

export default usePartnerActions;
