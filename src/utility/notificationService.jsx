import {
  getFirestore,
  doc,
  increment,
  serverTimestamp,
  writeBatch,
  getDoc,
} from "firebase/firestore";

// Using the native `crypto` library for generating UUID in web
const generateUUID = () => {
  return crypto.randomUUID();
};

// Initialize Firestore
const firestore = getFirestore();

// Save notification to Firestore
export const saveNotificationToFirestore = async (
  userData,
  userBData,
  type,
  tweet,
  collection,
  comment = ""
) => {
  const { uid, photoURL, displayName } = userData;
  const userDataNameURLUID = { uid, photoURL, displayName };

  const notification = {
    type: type,
    fromUser: userDataNameURLUID,
    timestamp: serverTimestamp(),
    read: false,
    tweet: tweet,
    collection: collection,
    comment: comment,
  };

  try {
    const batch = writeBatch(firestore);
    const notificationId = generateUUID(); // Generate unique ID for notification

    const userBNotificationRef = doc(
      firestore,
      "notifications",
      userBData.uid,
      "userNotifications",
      notificationId
    );
    batch.set(userBNotificationRef, notification);

    const userBRef = doc(firestore, "notifications", userBData.uid);
    batch.set(userBRef, { unread: increment(1) }, { merge: true });

    await batch.commit();
    console.log("Notification saved successfully!");
  } catch (error) {
    console.error("Error saving notification: ", error);
  }
};

// Send notification to user and save it to Firestore
export const sendNotificationToUser = async (
  sendNotificationFunc,
  userData,
  userBData,
  title,
  content,
  type
) => {
  try {
    // Save the notification to Firestore
    await saveNotificationToFirestore(userData, userBData, type, content);

    // Retrieve the target user's push notification token (this assumes you're using a service for web push notifications)
    const userBSnap = await getDoc(doc(firestore, "customers", userBData.uid));
    const token = userBSnap.data()?.expoPushToken;

    // Send the notification using the passed notification function
    if (token) {
      sendNotificationFunc(token, title, content + userData.displayName, {
        type: type,
      });
    } else {
      console.log("No push token available for the user");
    }
  } catch (error) {
    console.error("Error sending notification: ", error);
  }
};

// Send a push notification (without saving it to Firestore)
export const sendPushNotificationToUser = async (
  sendNotificationFunc,
  userData,
  userBData,
  title,
  content,
  type
) => {
  try {
    const userBSnap = await getDoc(doc(firestore, "customers", userBData.uid));
    const token = userBSnap.data()?.expoPushToken;

    if (token) {
      sendNotificationFunc(token, title, content + userData.displayName, {
        type: type,
      });
    } else {
      console.log("No push token available for the user");
    }
  } catch (error) {
    console.error("Error sending push notification: ", error);
  }
};
