import { useCallback } from "react";

async function sendPushNotification(expoPushToken, title, body, data) {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: title,
    body: body,
    data: data,
  };

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
  const sendNotification = useCallback((expoPushToken, title, body, data) => {
    sendPushNotification(expoPushToken, title, body, data);
  }, []);

  return { sendNotification };
}
