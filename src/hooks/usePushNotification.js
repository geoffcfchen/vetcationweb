// src/hooks/usePushNotification.js

import { useCallback } from "react";

async function sendPushNotification(
  expoPushToken,
  title,
  body,
  data,
  badgeCount,
) {
  if (!expoPushToken) return;

  const message = {
    to: expoPushToken,
    sound: "default",
    title,
    body,
    data,
  };

  if (typeof badgeCount === "number") {
    message.badge = badgeCount;
  }

  try {
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error("Failed to send push notification:", response.statusText);
    }
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}

export default function usePushNotification() {
  const sendNotification = useCallback(
    (expoPushToken, title, body, data, badgeCount) => {
      sendPushNotification(expoPushToken, title, body, data, badgeCount);
    },
    [],
  );

  return { sendNotification };
}
