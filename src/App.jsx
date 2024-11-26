import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

// import Header from "./components/Header";
// import HeroSection from "./components/HeroSection";
// import FeaturesSection from "./components/FeaturesSection";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import GlobalContext from "./context/GlobalContext";
import RegisterPage from "./pages/RegisterPage";
import "bootstrap/dist/css/bootstrap.min.css";
import GlobalStyle from "./GlobalStyle";

import RedirectPage from "./pages/RedirectPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import SMSTermsPage from "./pages/SMSTermsPage";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import { auth, firestore } from "./firebase";

function App() {
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const { setUserData } = useContext(GlobalContext);
  const navigate = useNavigate();

  // Handle authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsUserLoading(true);
      if (firebaseUser) {
        try {
          await firebaseUser.getIdToken(true); // Refresh token
          setUser(firebaseUser);
          await fetchUserData(firebaseUser.uid);
        } catch (error) {
          handleAuthError(error);
        }
      } else {
        setUser(null);
        setUserData(null);
        navigate("/");
      }
      setIsUserLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [setUserData, navigate, user]);

  // Fetch user data from Firestore
  async function fetchUserData(uid) {
    try {
      const userDocRef = doc(firestore, "customers", uid);
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        await setDoc(userDocRef, { hasCompletedProfile: false, uid });
        setUserData({ hasCompletedProfile: false, uid });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  // Handle authentication errors
  function handleAuthError(error) {
    console.error("Authentication error:", error);

    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/user-disabled"
    ) {
      signOut(auth);
    } else if (error.code === "auth/user-token-expired") {
      try {
        auth.currentUser?.getIdToken(true);
      } catch (refreshError) {
        console.error("Token refresh error:", refreshError);
        signOut(auth);
      }
    }
  }

  return (
    <>
      <GlobalStyle />
      <Routes>
        {/* <Route path="/" element={<RegisterPage />} /> */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/redirect" element={<RedirectPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/SMSTerms" element={<SMSTermsPage />} />
      </Routes>
    </>
  );
}

export default App;
