import React, { useContext, useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";

import Header from "./components/Header";
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

import ForVetPage from "./pages/ForVetPage";

import DocsLayout from "./pages/DocsLayout";

import DocsContent from "./data/docs/DocsContent";

import SupportPage from "./pages/SupportPage";
import { createGlobalStyle } from "styled-components";
import topNavData from "./data/topNavData";

// import LoginPage from "./pages/LoginPage";
// import DashboardPage from "./pages/DashboardPage";
// import { auth, firestore } from "./firebase";

const PrintStyles = createGlobalStyle`
@media print {
  /* Paper-friendly colors */
  html, body, #root { background:#fff !important; color:#000 !important; }
  * {
    color:#000 !important;
    background:transparent !important;
    box-shadow:none !important;
    text-shadow:none !important;
    filter:none !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  a, a:visited { color:#000 !important; text-decoration: underline; }
  svg, svg * { fill:#000 !important; stroke:#000 !important; }

  /* Neutralize sticky/fixed and transforms so headers don’t overlap pages */
  [style*="position: sticky"], [style*="position: fixed"],
  nav, header, .navbar, .TopNavBarContainer {
    position: static !important;
    top: auto !important;
    transform: none !important;
  }

  /* Remove layout offset added for sticky headers */
  main, .content, .page-content, #mainContent, #docsMain {
    padding-top: 0 !important;
    margin-top: 0 !important;
  }

  /* Keep page breaks tidy */
  h1, h2, h3 { break-after: avoid-page; }
  p, li { break-inside: avoid; }

  /* Hide elements you don’t want to print */
  .no-print { display: none !important; }

  /* Page margins */
  @page { margin: 12mm; }
}
`;

const HOME_DEFAULT =
  topNavData.find((i) => i.id === "home")?.defaultDocId || "introToVetcation";

function App() {
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const { setUserData } = useContext(GlobalContext);
  const navigate = useNavigate();

  // // Handle authentication state
  // useEffect(() => {
  //   const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
  //     setIsUserLoading(true);
  //     if (firebaseUser) {
  //       try {
  //         await firebaseUser.getIdToken(true); // Refresh token
  //         setUser(firebaseUser);
  //         await fetchUserData(firebaseUser.uid);
  //       } catch (error) {
  //         handleAuthError(error);
  //       }
  //     } else {
  //       setUser(null);
  //       setUserData(null);
  //       navigate("/");
  //     }
  //     setIsUserLoading(false);
  //   });

  //   return () => unsubscribe(); // Cleanup on unmount
  // }, [setUserData, navigate, user]);

  // // Fetch user data from Firestore
  // async function fetchUserData(uid) {
  //   try {
  //     const userDocRef = doc(firestore, "customers", uid);
  //     const docSnap = await getDoc(userDocRef);

  //     if (docSnap.exists()) {
  //       setUserData(docSnap.data());
  //     } else {
  //       await setDoc(userDocRef, { hasCompletedProfile: false, uid });
  //       setUserData({ hasCompletedProfile: false, uid });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching user data:", error);
  //   }
  // }

  // // Handle authentication errors
  // function handleAuthError(error) {
  //   console.error("Authentication error:", error);

  //   if (
  //     error.code === "auth/user-not-found" ||
  //     error.code === "auth/user-disabled"
  //   ) {
  //     signOut(auth);
  //   } else if (error.code === "auth/user-token-expired") {
  //     try {
  //       auth.currentUser?.getIdToken(true);
  //     } catch (refreshError) {
  //       console.error("Token refresh error:", refreshError);
  //       signOut(auth);
  //     }
  //   }
  // }

  return (
    <>
      <PrintStyles />
      <GlobalStyle />
      <Routes>
        {/* <Route path="/" element={<Header />} /> */}
        <Route path="/" element={<RegisterPage />} />
        <Route path="/vets" element={<ForVetPage />} />
        {/* <Route path="/mission" element={<MissionsPage />} /> */}
        {/* <Route path="/telemedicine-info" element={<DocsPageLayoutPage />} /> */}
        {/* The layout route for docs */}
        <Route path="/telemedicine-info" element={<DocsLayout />}>
          {/* Each child route is the middle content. */}

          {/* index: the default if user visits /telemedicine-info with no sub-path */}
          {/* <Route
            index
            element={
              <Navigate to="/telemedicine-info/home/introToVetcation" replace />
            }
          /> */}
          {/* <Route
            index
            element={
              <Navigate
                to="/telemedicine-info/home/introToVetcation"
                replace
                state={{ suppressInitialHash: true }}
              />
            }
          /> */}
          <Route
            index
            element={
              <Navigate
                to={`/telemedicine-info/home/${HOME_DEFAULT}`}
                replace
                state={{ suppressInitialHash: true }}
              />
            }
          />

          <Route path=":topNavId/:docId" element={<DocsContent />} />
          {/* <Route path="contributors" element={<ContributorsPage />} /> */}
        </Route>
        {/* <Route path="/" element={<LoginPage />} /> */}
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
        <Route path="/redirect" element={<RedirectPage />} />
        <Route path="/app" element={<RedirectPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/SMSTerms" element={<SMSTermsPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Routes>
    </>
  );
}

export default App;
