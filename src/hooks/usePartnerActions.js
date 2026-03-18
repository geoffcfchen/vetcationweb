// src/hooks/usePartnerActions.js
import { v4 as uuidv4 } from "uuid";
import {
  getFirestore,
  collection,
  doc,
  writeBatch,
  serverTimestamp,
  increment,
  getDoc,
  deleteField,
} from "firebase/firestore";
import usePushNotification from "./usePushNotification";

const firestore = getFirestore();

const DEFAULT_PARTNER_SPLIT_BPS = {
  vet: 6000,
  clinic: 2500,
  platform: 1500,
};

function ensureSplitBps(split) {
  const vet = Number(split?.vet ?? 0);
  const clinic = Number(split?.clinic ?? 0);
  const platform = Number(split?.platform ?? 0);

  if (![vet, clinic, platform].every(Number.isInteger)) {
    throw new Error("Split must be integer bps");
  }

  const sum = vet + clinic + platform;
  if (sum !== 10000) {
    throw new Error(`Split must sum to 10000 bps, got ${sum}`);
  }

  return { vet, clinic, platform };
}

function usePartnerActions({
  userData,
  userBData,
  RefInitiator,
  RefReceiver,
  RefInitiatorParent,
  RefReceiverParent,
}) {
  const { sendNotification } = usePushNotification();

  const proposed = ensureSplitBps(DEFAULT_PARTNER_SPLIT_BPS);

  const onRequestPartner = async () => {
    try {
      if (!RefInitiator || !RefReceiver) return;

      const batch = writeBatch(firestore);

      const notificationId = uuidv4();
      const { uid, photoURL, displayName } = userData || {};
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
          "userNotifications",
        ),
        notificationId,
      );

      batch.set(userBNotificationRef, notification);

      const userBRef = doc(firestore, "notifications", userBData.uid);
      batch.set(userBRef, { unread: increment(1) }, { merge: true });

      if (RefInitiatorParent) {
        batch.set(RefInitiatorParent, {}, { merge: true });
      }

      batch.set(
        RefInitiator,
        {
          status: "pending",
          initiator: userData.uid,
          notificationId,
          RequestTimestamp: serverTimestamp(),

          proposed_split_bps: proposed,
          proposed_by: userData.uid,
          proposed_at: serverTimestamp(),
        },
        { merge: true },
      );

      if (RefReceiverParent) {
        batch.set(RefReceiverParent, {}, { merge: true });
      }

      batch.set(
        RefReceiver,
        {
          status: "pending",
          initiator: userData.uid,
          RequestTimestamp: serverTimestamp(),

          proposed_split_bps: proposed,
          proposed_by: userData.uid,
          proposed_at: serverTimestamp(),
        },
        { merge: true },
      );

      await batch.commit();

      const userBSnap = await getDoc(
        doc(firestore, "customers", userBData.uid),
      );
      const token = userBSnap.data()?.expoPushToken;

      if (token) {
        sendNotification(
          token,
          "New Partnership Request",
          `You have a new partnership request from ${userData.displayName}`,
          { type: "PartnerRequest" },
        );
      }
    } catch (error) {
      console.error("Error sending partnership request:", error);
    }
  };

  const onUnRequestPartner = async () => {
    try {
      if (!RefInitiator || !RefReceiver) return;

      const batch = writeBatch(firestore);

      const refInitiatorSnap = await getDoc(RefInitiator);
      const oldNotificationId = refInitiatorSnap.data()?.notificationId;

      if (oldNotificationId) {
        const userBNotificationRef = doc(
          collection(
            firestore,
            "notifications",
            userBData.uid,
            "userNotifications",
          ),
          oldNotificationId,
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
      if (!RefInitiator || !RefReceiver) return;

      const batch = writeBatch(firestore);

      const initSnap = await getDoc(RefInitiator);
      const proposedSplit =
        initSnap.data()?.proposed_split_bps || DEFAULT_PARTNER_SPLIT_BPS;
      const split = ensureSplitBps(proposedSplit);

      const notificationId = uuidv4();
      const { uid, photoURL, displayName } = userData || {};
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
          "userNotifications",
        ),
        notificationId,
      );
      batch.set(userBNotificationRef, notification);

      const userBRef = doc(firestore, "notifications", userBData.uid);
      batch.set(userBRef, { unread: increment(1) }, { merge: true });

      batch.set(
        RefInitiator,
        {
          status: "approved",
          confirmationTimestamp: serverTimestamp(),
          notificationId,

          split_bps: split,
          approved_by: userData.uid,
          approved_at: serverTimestamp(),

          proposed_split_bps: deleteField(),
          proposed_by: deleteField(),
          proposed_at: deleteField(),
        },
        { merge: true },
      );

      batch.set(
        RefReceiver,
        {
          status: "approved",
          confirmationTimestamp: serverTimestamp(),

          split_bps: split,
          approved_by: userData.uid,
          approved_at: serverTimestamp(),

          proposed_split_bps: deleteField(),
          proposed_by: deleteField(),
          proposed_at: deleteField(),
        },
        { merge: true },
      );

      await batch.commit();

      const userBSnap = await getDoc(
        doc(firestore, "customers", userBData.uid),
      );
      const token = userBSnap.data()?.expoPushToken;

      if (token) {
        sendNotification(
          token,
          "Partnership Confirmed",
          `${userData.displayName} has confirmed your partnership request.`,
          { type: "PartnerRequestConfirmed" },
        );
      }
    } catch (error) {
      console.error("Error confirming partnership:", error);
    }
  };

  const onEndPartner = async () => {
    try {
      if (!RefInitiator || !RefReceiver) return;

      const batch = writeBatch(firestore);

      const notificationId = uuidv4();
      const { uid, photoURL, displayName } = userData || {};
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
          "userNotifications",
        ),
        notificationId,
      );
      batch.set(userBNotificationRef, notification);

      const userBRef = doc(firestore, "notifications", userBData.uid);
      batch.set(userBRef, { unread: increment(1) }, { merge: true });

      batch.set(
        RefInitiator,
        {
          status: null,
          cancellationTimestamp: serverTimestamp(),
          initiator: deleteField(),

          split_bps: deleteField(),
          approved_by: deleteField(),
          approved_at: deleteField(),
          proposed_split_bps: deleteField(),
          proposed_by: deleteField(),
          proposed_at: deleteField(),
        },
        { merge: true },
      );

      batch.set(
        RefReceiver,
        {
          status: null,
          cancellationTimestamp: serverTimestamp(),
          initiator: deleteField(),

          split_bps: deleteField(),
          approved_by: deleteField(),
          approved_at: deleteField(),
          proposed_split_bps: deleteField(),
          proposed_by: deleteField(),
          proposed_at: deleteField(),
        },
        { merge: true },
      );

      await batch.commit();

      const userBSnap = await getDoc(
        doc(firestore, "customers", userBData.uid),
      );
      const token = userBSnap.data()?.expoPushToken;

      if (token) {
        sendNotification(
          token,
          "Partnership Request Ended",
          `${userData.displayName} has ended the partnership.`,
          { type: "PartnerEnded" },
        );
      }
    } catch (error) {
      console.error("Error ending partnership:", error);
    }
  };

  const onDeclinePartner = async () => {
    try {
      if (!RefInitiator || !RefReceiver) return;

      const batch = writeBatch(firestore);

      const notificationId = uuidv4();
      const { uid, photoURL, displayName } = userData || {};
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
          "userNotifications",
        ),
        notificationId,
      );
      batch.set(userBNotificationRef, notification);

      const userBRef = doc(firestore, "notifications", userBData.uid);
      batch.set(userBRef, { unread: increment(1) }, { merge: true });

      batch.set(
        RefInitiator,
        {
          status: null,
          declineTimestamp: serverTimestamp(),
          initiator: deleteField(),

          split_bps: deleteField(),
          approved_by: deleteField(),
          approved_at: deleteField(),
          proposed_split_bps: deleteField(),
          proposed_by: deleteField(),
          proposed_at: deleteField(),
        },
        { merge: true },
      );

      batch.set(
        RefReceiver,
        {
          status: null,
          declineTimestamp: serverTimestamp(),
          initiator: deleteField(),

          split_bps: deleteField(),
          approved_by: deleteField(),
          approved_at: deleteField(),
          proposed_split_bps: deleteField(),
          proposed_by: deleteField(),
          proposed_at: deleteField(),
        },
        { merge: true },
      );

      await batch.commit();

      const userBSnap = await getDoc(
        doc(firestore, "customers", userBData.uid),
      );
      const token = userBSnap.data()?.expoPushToken;

      if (token) {
        sendNotification(
          token,
          "Partnership Request Declined",
          `${userData.displayName} has declined your partnership request.`,
          { type: "PartnerRequestDeclined" },
        );
      }
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
