import React, { useEffect } from "react";

const RedirectPage = () => {
  useEffect(() => {
    const redirectToStore = () => {
      const userAgent = navigator.userAgent || window.opera;
      console.log("User Agent:", userAgent);

      const iOS = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
      const Android = /android/i.test(userAgent);

      console.log("Is iOS:", iOS);
      console.log("Is Android:", Android);

      setTimeout(() => {
        if (iOS) {
          window.location.href =
            "https://apps.apple.com/us/app/vetcation/id6470849243"; // Replace with your Apple App Store link
        } else if (Android) {
          window.location.href =
            "https://play.google.com/store/apps/details?id=com.vetcation.vetcationapp"; // Replace with your Google Play Store link
        } else {
          console.log("Non-mobile device detected or OS not recognized.");
        }
      }, 500); // 500ms delay
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
