import React, { useContext, useState, useEffect } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";

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
import { Helmet, HelmetProvider } from "react-helmet-async";

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

/** --- SEO helper that sets <title>, <meta description>, and canonical per path --- */
function SeoForPath() {
  const { pathname } = useLocation();

  // Always build canonicals with trailing slash:
  const canonical = `https://vetcation.com${
    pathname.endsWith("/") ? pathname : pathname + "/"
  }`;

  // Map concrete paths to titles/descriptions.
  // Start with your priority pages; you can add more anytime.
  const metaMap = {
    "/": {
      title:
        "Vetcation — Telemedicine & Community for Veterinary Professionals",
      description:
        "Launch a virtual clinic, collaborate with hospitals, and deliver compliant telemedicine under California AB 1399 with audit-ready documentation.",
    },
    "/vets": {
      title: "For Veterinarians — Launch Your Virtual Clinic | Vetcation",
      description:
        "Set your schedule, keep client relationships and records, and earn through structured telemedicine and follow-ups using Vetssenger.",
    },
    "/support": {
      title: "Support | Vetcation",
      description:
        "Get help with your Vetcation account, billing, scheduling, video calls, and compliance questions.",
    },
    "/privacy-policy": {
      title: "Privacy Policy | Vetcation",
      description:
        "Learn how Vetcation collects, uses, and protects your personal information.",
    },
    "/SMSTerms": {
      title: "SMS Terms | Vetcation",
      description: "Read Vetcation’s SMS program terms and conditions.",
    },

    // Docs hub
    "/telemedicine-info/": {
      title: "Telemedicine Information & Guides | Vetcation",
      description:
        "Guides for veterinarians, clinics, and corporate groups: setup, compliance, and workflows.",
    },

    // HOME (vets) key pages
    "/telemedicine-info/home/introToVetcation/": {
      title: "Introduction for Veterinarians | Vetcation Telemedicine",
      description:
        "How Vetcation helps California-licensed veterinarians launch a virtual clinic and build lasting client relationships.",
    },
    "/telemedicine-info/home/VirtualClinic/": {
      title: "Virtual Clinic — How It Works | Vetcation",
      description:
        "Provide telemedicine consults under your professional profile, keep ownership of clients and records, and collaborate with clinics.",
    },
    "/telemedicine-info/home/scheduleOverview/": {
      title: "Scheduling Overview — Availability & Minimum Notice | Vetcation",
      description:
        "Manage your availability, minimum notice times, and pauses to control your virtual clinic workflow.",
    },
    "/telemedicine-info/home/joinVideoCall/": {
      title: "Join a Video Call — Setup & Tips | Vetcation",
      description:
        "How to join video consults, device setup tips, and call features inside Vetcation.",
    },
    "/telemedicine-info/home/InquiryBasedMessagerOverView/": {
      title: "Inquiry-Based Messenger Overview | Vetcation",
      description:
        "Use Vetssenger for structured follow-ups, asynchronous Q&A, and inquiry-based workflows.",
    },
    "/telemedicine-info/home/MedicalHistoryOverview/": {
      title: "Medical History Overview — Records & Notes | Vetcation",
      description:
        "Capture, review, and share visit notes and summaries; maintain audit-ready documentation.",
    },
    "/telemedicine-info/home/CommunityMarketing/": {
      title: "Community & Marketing — Grow Your Practice | Vetcation",
      description:
        "Best practices to build trust, community presence, and recurring relationships with pet owners.",
    },
    "/telemedicine-info/home/partnerWithClinic/": {
      title: "Partner with a Clinic — Collaboration Model | Vetcation",
      description:
        "How vets collaborate with clinics to expand capacity, escalate in-person care, and align responsibilities.",
    },

    // Compliance pages (home)
    "/telemedicine-info/home/Bill1399/": {
      title: "AB 1399 FAQ — California Telemedicine for Vets | Vetcation",
      description:
        "Understand California AB 1399 telemedicine rules for veterinarians, including VCPR and documentation.",
    },
    "/telemedicine-info/home/VCPR/": {
      title: "VCPR — Establishment & Requirements | Vetcation",
      description:
        "Learn how VCPR applies to telemedicine and how Vetcation supports compliant workflows.",
    },
    "/telemedicine-info/home/PrescriptionLimits/": {
      title: "Prescription Limits in Telemedicine | Vetcation",
      description:
        "Guidance on prescribing within telemedicine parameters and documentation best practices.",
    },
    "/telemedicine-info/home/PrivacyConfidentiality/": {
      title: "Privacy & Confidentiality | Vetcation",
      description:
        "How Vetcation protects client privacy and supports confidentiality in virtual care.",
    },
    "/telemedicine-info/home/RacehorseCHRBRestrictions/": {
      title: "Racehorse & CHRB Restrictions | Vetcation",
      description:
        "Key restrictions and considerations for racehorse telemedicine under CHRB rules.",
    },
    "/telemedicine-info/home/RecordKeepingDocumentation/": {
      title: "Record-Keeping & Documentation | Vetcation",
      description:
        "Audit-ready documentation, visit notes, and data retention practices for telemedicine.",
    },
    "/telemedicine-info/home/MiscellaneousClarifications/": {
      title: "Miscellaneous Clarifications | Vetcation",
      description:
        "Additional compliance clarifications and edge cases for California telemedicine.",
    },

    // Clinics
    "/telemedicine-info/clinics/clinicIntroToVetcation/": {
      title:
        "Introduction for Clinics — Hospital-Branded Virtual Branch | Vetcation",
      description:
        "Launch a hospital-branded virtual branch with trusted relief veterinarians; expand capacity without adding payroll.",
    },
    "/telemedicine-info/clinics/VirtualBranch/": {
      title: "Virtual Branch — Setup & Operations | Vetcation",
      description:
        "How clinics configure the virtual branch, approve providers, and integrate with in-person workflows.",
    },

    // Corporations
    "/telemedicine-info/corporations/corpIntroToVetcation/": {
      title: "Introduction for Corporate Veterinary Groups | Vetcation",
      description:
        "Launch a hospital-branded virtual network across multiple hospitals with clear economics and compliance.",
    },

    // Contributors
    "/telemedicine-info/contributors/ourContributors/": {
      title: "Our Contributors — Vets, Technicians, and Advisors | Vetcation",
      description:
        "Meet the professionals who contribute to the Vetcation knowledge-sharing community.",
    },
  };

  // Normalize the key (we want trailing slash in keys)
  const key = pathname.endsWith("/") ? pathname : pathname + "/";
  const fallback = {
    title: "Vetcation",
    description:
      "Telemedicine and community platform for veterinary professionals.",
  };
  const meta = metaMap[key] || metaMap[pathname] || fallback;

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={canonical} />
    </Helmet>
  );
}

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
    <HelmetProvider>
      <PrintStyles />
      <GlobalStyle />
      {/* Global/default SEO for current path */}
      <SeoForPath />
      <Routes>
        {/* <Route path="/" element={<Header />} /> */}
        <Route path="/" element={<RegisterPage />} />
        {/* <Route path="/vets" element={<ForVetPage />} /> */}
        {/* <Route path="/mission" element={<MissionsPage />} /> */}
        {/* <Route path="/telemedicine-info" element={<DocsPageLayoutPage />} /> */}
        {/* The layout route for docs */}
        <Route path="/telemedicine-info/" element={<DocsLayout />}>
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
                to={`/telemedicine-info/home/${HOME_DEFAULT}/`}
                replace
                state={{ suppressInitialHash: true }}
              />
            }
          />

          <Route path=":topNavId/:docId/" element={<DocsContent />} />
          {/* <Route path="contributors" element={<ContributorsPage />} /> */}
        </Route>
        {/* <Route path="/" element={<LoginPage />} /> */}
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
        <Route path="/redirect/" element={<RedirectPage />} />
        <Route path="/app/" element={<RedirectPage />} />
        <Route path="/privacy-policy/" element={<PrivacyPolicyPage />} />
        <Route path="/SMSTerms/" element={<SMSTermsPage />} />
        <Route path="/support/" element={<SupportPage />} />
      </Routes>
    </HelmetProvider>
  );
}

export default App;
