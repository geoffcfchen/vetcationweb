import React, { useEffect } from "react";

const RedirectPage = () => {
  useEffect(() => {
    const redirectToStore = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const iOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
      const Android = /android/i.test(userAgent);

      if (iOS) {
        window.location.href = "https://apps.apple.com/app/idYOUR_APP_ID"; // Replace with your Apple App Store link
      } else if (Android) {
        window.location.href =
          "https://play.google.com/store/apps/details?id=YOUR_PACKAGE_NAME"; // Replace with your Google Play Store link
      } else {
        // Optional: Redirect to a generic page or show an error
        console.log("Non-mobile device detected or OS not recognized.");
      }
    };

    redirectToStore();
  }, []);

  return (
    <div>
      <h1>Redirecting...</h1>
      <p>Please wait while we redirect you to the appropriate app store.</p>
    </div>
  );
};

export default RedirectPage;
