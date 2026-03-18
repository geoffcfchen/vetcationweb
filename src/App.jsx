import React, { useContext, useState, useEffect, useRef } from "react";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
// import FeaturesSection from "./components/FeaturesSection";
// import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
// import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
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
import InviteSurvey from "./pages/InviteSurvey";
import AiLibraryPage from "./pages/AiLibraryPage";
import LoginPage from "./pages/LoginPage";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, firestore } from "./lib/firebase";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import EmailRegisterPage from "./pages/EmailRegisterPage";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import HandoutsPage from "./pages/HandoutsPage";
import VetUploadRecordPage from "./pages/VetUploadRecordPage";
import PetSummarySharePage from "./pages/PetSummarySharePage";
import UniversalRecordsPage from "./pages/UniversalRecordsPage";
import MyPetHealthPage from "./pages/MyPetHealthPage";
import RequireAuth from "./components/RequireAuth";

import PetHealthLayout from "./pages/app/PetHealthLayout";
import PetOverviewPage from "./pages/app/PetOverviewPage";
import PetRecordsPage from "./pages/app/PetRecordsPage";
import PetUploadPage from "./pages/app/PetUploadPage";
import PetPassportPage from "./pages/app/PetPassportPage";
import PetSharePage from "./pages/app/PetSharePage";
import PetSettingsPage from "./pages/app/PetSettingsPage";
import NewPetPage from "./pages/app/NewPetPage";
import VetReadySummaryPage from "./pages/app/VetReadySummaryPage";
import VaccinePage from "./pages/app/VaccinePage";
import MemoizedPetHealthLayout from "./pages/app/PetHealthLayout";
import ScrollToTop from "./components/ScrollToTop";
import ForShelterPage from "./pages/ForShelterPage";
import MissionPage from "./pages/MissionPage";
import TeamPage from "./pages/TeamPage";
import RoleSelectionPage from "./pages/onboarding/RoleSelectionPage";
import ProfileOnboardingPage from "./pages/onboarding/ProfileOnboardingPage";
import ScanQrOnboardingPage from "./pages/onboarding/ScanQrOnboardingPage";
import SelectClinicOnboardingPage from "./pages/onboarding/SelectClinicOnboardingPage";
import WalletPage from "./pages/app/WalletPage";
import DashboardPage from "./pages/app/DashboardPage";
import TelehealthSettingsPage from "./pages/app/TelehealthSettingsPage";
import PartnershipHubPage from "./pages/app/PartnershipHubPage";
import TelemedProfileEditPage from "./pages/app/TelemedProfileEditPage";

// import LoginPage from "./pages/LoginPage";

// import LoginPage from "./pages/LoginPage";
// import DashboardPage from "./pages/DashboardPage";
// import { auth, firestore } from "./firebase";

const PrintStyles = createGlobalStyle`
@media print {
  @page {
    size: letter;
    margin: 10mm;
  }

  html, body, #root {
    background: #fff !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .no-print { display: none !important; }

  body.print-handout [data-handout-shell] {
    padding: 0 !important;
  }

  body.print-handout [data-handout-preview-frame] {
    justify-content: flex-start !important;
  }

  [data-handout-paper] {
    width: 100% !important;
    min-height: auto !important;
    box-shadow: none !important;
    border-radius: 0 !important;
  }
}
`;

const HOME_DEFAULT =
  topNavData.find((i) => i.id === "home")?.defaultDocId || "introToVetcation";

// Add near the top of App.jsx (above SeoForPath)
const BRAND = {
  company: "Vetcation",
  product: "MyPet Health",
  full: "MyPet Health by Vetcation",
  domain: "https://vetcation.com",
};

/** --- SEO helper that sets <title>, <meta description>, and canonical per path --- */
function SeoForPath() {
  const { pathname } = useLocation();

  // Always build canonicals with trailing slash:
  const canonical = `https://vetcation.com${
    pathname.endsWith("/") ? pathname : pathname + "/"
  }`;

  const defaultMeta = {
    title: `${BRAND.full} | Universal Medical Record for Pets`,
    description:
      "Keep your pet’s health organized in one place. Pull records from any clinic, share instantly, message your vet when you need help, and get meds when appropriate.",
  };

  // Map concrete paths to titles/descriptions.
  // Start with your priority pages; you can add more anytime.
  const metaMap = {
    "/": {
      title: `${BRAND.full} | Universal Medical Record for Pets`,
      description: defaultMeta.description,
    },
    "/mypet-health/": {
      title: `MyPet Health by Vetcation | Official Site`,
      description: defaultMeta.description,
    },
    "/pet-health-record/": {
      title: `Pet Health Record | ${BRAND.full}`,
      description:
        "MyPet Health pulls your pet’s scattered health records from any clinic into one secure place and turns them into a clear, vet-ready timeline. Share it in one click.",
    },
    "/support/": {
      title: `Support | ${BRAND.full}`,
      description:
        "Get help with your MyPet Health account, billing, scheduling, video calls, and compliance questions.",
    },
    "/privacy-policy/": {
      title: `Privacy Policy | ${BRAND.full}`,
      description:
        "Learn how MyPet Health collects, uses, and protects your personal information.",
    },
    "/SMSTerms/": {
      title: `SMS Terms | ${BRAND.full}`,
      description: "Read MyPet Health’s SMS program terms and conditions.",
    },

    // HOME (vets) key pages
    "/telemedicine-info/home/introToVetcation/": {
      title: "Introduction for Veterinarians | MyPet Health Telemedicine",
      description:
        "How MyPet Health helps California-licensed veterinarians launch a virtual clinic and build lasting client relationships.",
    },
    "/telemedicine-info/home/VirtualClinic/": {
      title: "Virtual Clinic — How It Works | MyPet Health",
      description:
        "Provide telemedicine consults under your professional profile, keep ownership of clients and records, and collaborate with clinics.",
    },
    "/telemedicine-info/home/scheduleOverview/": {
      title:
        "Scheduling Overview — Availability & Minimum Notice | MyPet Health",
      description:
        "Manage your availability, minimum notice times, and pauses to control your virtual clinic workflow.",
    },
    "/telemedicine-info/home/joinVideoCall/": {
      title: "Join a Video Call — Setup & Tips | MyPet Health",
      description:
        "How to join video consults, device setup tips, and call features inside MyPet Health.",
    },
    "/telemedicine-info/home/InquiryBasedMessagerOverView/": {
      title: "Inquiry-Based Messenger Overview | MyPet Health",
      description:
        "Use Vetssenger for structured follow-ups, asynchronous Q&A, and inquiry-based workflows.",
    },
    "/telemedicine-info/home/MedicalHistoryOverview/": {
      title: "Medical History Overview — Records & Notes | MyPet Health",
      description:
        "Capture, review, and share visit notes and summaries; maintain audit-ready documentation.",
    },
    "/telemedicine-info/home/CommunityMarketing/": {
      title: "Community & Marketing — Grow Your Practice | MyPet Health",
      description:
        "Best practices to build trust, community presence, and recurring relationships with pet owners.",
    },
    "/telemedicine-info/home/partnerWithClinic/": {
      title: "Partner with a Clinic — Collaboration Model | MyPet Health",
      description:
        "How vets collaborate with clinics to expand capacity, escalate in-person care, and align responsibilities.",
    },

    // Compliance pages (home)
    "/telemedicine-info/compliance/Bill1399/": {
      title: "AB 1399 FAQ — California Telemedicine for Vets | MyPet Health",
      description:
        "Understand California AB 1399 telemedicine rules for veterinarians, including VCPR and documentation.",
    },
    "/telemedicine-info/compliance/VCPR/": {
      title: "VCPR — Establishment & Requirements | MyPet Health",
      description:
        "Learn how VCPR applies to telemedicine and how MyPet Health supports compliant workflows.",
    },
    "/telemedicine-info/compliance/PrescriptionLimits/": {
      title: "Prescription Limits in Telemedicine | MyPet Health",
      description:
        "Guidance on prescribing within telemedicine parameters and documentation best practices.",
    },
    "/telemedicine-info/compliance/PrivacyConfidentiality/": {
      title: "Privacy & Confidentiality | MyPet Health",
      description:
        "How MyPet Health protects client privacy and supports confidentiality in virtual care.",
    },
    "/telemedicine-info/compliance/RacehorseCHRBRestrictions/": {
      title: "Racehorse & CHRB Restrictions | MyPet Health",
      description:
        "Key restrictions and considerations for racehorse telemedicine under CHRB rules.",
    },
    "/telemedicine-info/compliance/RecordKeepingDocumentation/": {
      title: "Record-Keeping & Documentation | MyPet Health",
      description:
        "Audit-ready documentation, visit notes, and data retention practices for telemedicine.",
    },
    "/telemedicine-info/compliance/MiscellaneousClarifications/": {
      title: "Miscellaneous Clarifications | MyPet Health",
      description:
        "Additional compliance clarifications and edge cases for California telemedicine.",
    },

    // Clinics
    "/telemedicine-info/clinics/clinicIntroToVetcation/": {
      title:
        "Introduction for Clinics — Hospital-Branded Virtual Branch | MyPet Health",
      description:
        "Launch a hospital-branded virtual branch with trusted relief veterinarians; expand capacity without adding payroll.",
    },
    "/telemedicine-info/clinics/VirtualBranch/": {
      title: "Virtual Branch — Setup & Operations | MyPet Health",
      description:
        "How clinics configure the virtual branch, approve providers, and integrate with in-person workflows.",
    },

    // Corporations
    "/telemedicine-info/corporations/corpIntroToVetcation/": {
      title: "Introduction for Corporate Veterinary Groups | MyPet Health",
      description:
        "Launch a hospital-branded virtual network across multiple hospitals with clear economics and compliance.",
    },

    // Contributors
    "/telemedicine-info/contributors/ourContributors/": {
      title:
        "Our Contributors — Vets, Technicians, and Advisors | MyPet Health",
      description:
        "Meet the professionals who contribute to the MyPet Health knowledge-sharing community.",
    },
  };

  // Normalize the key (we want trailing slash in keys)

  const meta =
    metaMap[canonical.replace(BRAND.domain, "")] ||
    metaMap[pathname] ||
    defaultMeta;

  return (
    <Helmet>
      <title>{meta.title}</title>
      <meta name="description" content={meta.description} />
      <link rel="canonical" href={canonical} />
      {/* Optional but recommended */}
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:url" content={canonical} />
    </Helmet>
  );
}

function getOnboardingTarget(customer) {
  const role = customer?.role || null;

  // // Role not chosen yet
  // if (!role) return "/onboarding/role";

  // // Match your RN behavior: Organization goes to ScanQRcode
  // if (role?.label === "Organization" || role?.label === "Clinic") {
  //   return "/onboarding/scan-qrcode";
  // }

  // Pet owners, vets, techs, professionals go to Profile
  return "/onboarding/role";
}

function App() {
  const [user, setUser] = useState(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const { setUserData, userData } = useContext(GlobalContext);
  const navigate = useNavigate();
  const location = useLocation();

  const latestLocationRef = useRef(location);

  useEffect(() => {
    latestLocationRef.current = location;
  }, [location]);

  useEffect(() => {
    const uid = user?.uid || null;
    if (!uid) return;

    const ref = doc(firestore, "customers", uid);

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setUserData(snap.data());
      } else {
        setUserData(null);
      }
    });

    return () => unsub();
  }, [user?.uid, setUserData]);

  async function ensureCustomerDoc(firebaseUser) {
    const uid = firebaseUser.uid;
    const ref = doc(firestore, "customers", uid);
    const snap = await getDoc(ref);

    const existing = snap.exists() ? snap.data() : {};

    const patch = {};

    // Always ensure uid exists
    if (!existing.uid) patch.uid = uid;

    // Ensure email exists (RN parity)
    if (!existing.email && firebaseUser.email) {
      patch.email = firebaseUser.email.toLowerCase();
    }

    // Ensure providerId exists
    if (!existing.providerId) {
      patch.providerId =
        firebaseUser.providerData?.[0]?.providerId || "unknown";
    }

    // Ensure hasCompletedProfile exists
    if (typeof existing.hasCompletedProfile !== "boolean") {
      patch.hasCompletedProfile = false;
    }

    // Ensure createdAt exists
    if (!existing.createdAt) {
      patch.createdAt = serverTimestamp();
    }

    // Optional: save Firebase creationTime
    if (!existing.creationTime && firebaseUser?.metadata?.creationTime) {
      patch.creationTime = firebaseUser.metadata.creationTime;
    }

    // Optional: initial displayName/photoURL if missing
    if (!existing.displayName && firebaseUser.displayName) {
      patch.displayName = firebaseUser.displayName;
    }
    if (!existing.photoURL && firebaseUser.photoURL) {
      patch.photoURL = firebaseUser.photoURL;
    }

    // If anything missing, patch it in
    if (Object.keys(patch).length > 0) {
      await setDoc(ref, patch, { merge: true });
    }

    // Return something usable for gating immediately
    return { ...existing, ...patch };
  }

  function handleAuthError(error) {
    console.error("Authentication error:", error);

    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/user-disabled"
    ) {
      signOut(auth);
    } else if (error.code === "auth/user-token-expired") {
      auth.currentUser?.getIdToken(true).catch((refreshError) => {
        console.error("Token refresh error:", refreshError);
        signOut(auth);
      });
    }
  }

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      const currentPath = latestLocationRef.current.pathname;

      setIsUserLoading(true);

      if (!firebaseUser) {
        console.log("Auth state changed: no user");
        setUser(null);
        setUserData(null);

        // If user gets logged out while on a protected page, send them home
        if (currentPath.startsWith("/ai/") || currentPath.startsWith("/app")) {
          navigate("/", { replace: true });
        }

        setIsUserLoading(false);
        return;
      }

      try {
        // Force refresh token once when auth state changes
        await firebaseUser.getIdToken(true);
      } catch (error) {
        handleAuthError(error);
        setIsUserLoading(false);
        return;
      }

      try {
        setUser(firebaseUser);

        // 1) Ensure customers/{uid} exists
        // await ensureCustomerDoc(firebaseUser);
        const customer = await ensureCustomerDoc(firebaseUser);

        // 2) Email verification gating
        const email = firebaseUser.email || "";
        const isSystemEmail =
          email.startsWith("client") ||
          email.startsWith("doctor") ||
          email.startsWith("tech") ||
          email.startsWith("clinic") ||
          email.startsWith("csr");

        if (!firebaseUser.emailVerified && !isSystemEmail) {
          if (currentPath !== "/email-verification") {
            navigate("/email-verification", { replace: true });
          }
          setIsUserLoading(false);
          return;
        }

        // 3) Onboarding gating (NEW)
        // hasCompletedProfile includes role + profile completion, same as RN
        const needsOnboarding = !customer?.hasCompletedProfile;

        if (needsOnboarding) {
          const onboardingTarget = getOnboardingTarget(customer);
          const isAlreadyOnOnboarding = currentPath.startsWith("/onboarding/");

          // Important: do NOT consume postAuthRedirectPath yet.
          // We want to finish onboarding first, then go to target (/app, /ai/library, etc).
          if (!isAlreadyOnOnboarding && currentPath !== onboardingTarget) {
            navigate(onboardingTarget, { replace: true });
          }

          setIsUserLoading(false);
          return;
        }

        // 4) Post-auth redirect logic
        const stored = sessionStorage.getItem("postAuthRedirectPath");
        console.log("[auth listener] stored redirect:", stored);

        let target = stored || null;

        if (
          !target &&
          (currentPath === "/" ||
            currentPath === "/login" ||
            currentPath === "/register-email" ||
            currentPath === "/email-verification")
        ) {
          target = "/app";
        }

        if (stored) {
          sessionStorage.removeItem("postAuthRedirectPath");
        }

        if (target && currentPath !== target) {
          console.log("Auth listener navigating to:", target);
          navigate(target, { replace: true });
        }
      } catch (err) {
        console.error("Error ensuring customer doc or routing:", err);
      } finally {
        setIsUserLoading(false);
      }
    });

    return () => unsub();
  }, [navigate, setUserData]);

  return (
    <HelmetProvider>
      <PrintStyles />
      <GlobalStyle />
      {/* Global/default SEO for current path */}
      <SeoForPath />
      <ScrollToTop />
      <Routes>
        {/* <Route path="/" element={<Header />} /> */}
        <Route path="/" element={<RegisterPage />} />
        <Route path="/mypet-health/" element={<MyPetHealthPage />} />
        <Route path="/pet-health-record/" element={<UniversalRecordsPage />} />
        <Route path="/invite/:clinicId/:token" element={<InviteSurvey />} />
        <Route path="/ai/library/*" element={<AiLibraryPage />} />
        <Route path="/ai/handouts/*" element={<HandoutsPage />} />
        <Route path="/email-verification" element={<EmailVerificationPage />} />
        <Route path="/register-email" element={<EmailRegisterPage />} />
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
        <Route path="/login" element={<LoginPage />} />
        <Route path="/pet-upload/:inviteId" element={<VetUploadRecordPage />} />
        <Route path="/pet-summary/:shareId" element={<PetSummarySharePage />} />
        <Route path="/for-shelters/" element={<ForShelterPage />} />
        <Route path="/mission/" element={<MissionPage />} />
        <Route path="/team/" element={<TeamPage />} />
        {/* <Route path="/dashboard" element={<DashboardPage />} /> */}
        <Route path="/redirect/" element={<RedirectPage />} />
        {/* Auth guard layout */}
        <Route element={<RequireAuth user={user} isLoading={isUserLoading} />}>
          <Route path="/onboarding/role" element={<RoleSelectionPage />} />
          <Route
            path="/onboarding/profile"
            element={<ProfileOnboardingPage />}
          />
          <Route
            path="/onboarding/scan-qrcode"
            element={<ScanQrOnboardingPage />}
          />
          <Route
            path="/onboarding/select-clinic"
            element={<SelectClinicOnboardingPage />}
          />
          {/* App shell layout */}
          <Route path="/app" element={<MemoizedPetHealthLayout />}>
            <Route path="wallet" element={<WalletPage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route
              path="telehealth/settings"
              element={<TelehealthSettingsPage />}
            />
            <Route
              path="telehealth/profile"
              element={<TelemedProfileEditPage />}
            />
            <Route
              path="telehealth/partnership-hub"
              element={<PartnershipHubPage />}
            />
            <Route path="new-pet" element={<NewPetPage />} />

            <Route path="pets/:petId/records" element={<PetRecordsPage />} />
            <Route path="pets/:petId/passport" element={<PetPassportPage />} />
            <Route
              path="pets/:petId/vetreadysummary"
              element={<VetReadySummaryPage />}
            />
            <Route path="pets/:petId/vaccines" element={<VaccinePage />} />
            <Route path="pets/:petId/settings" element={<PetSettingsPage />} />
          </Route>
        </Route>
        <Route path="/privacy-policy/" element={<PrivacyPolicyPage />} />
        <Route path="/SMSTerms/" element={<SMSTermsPage />} />
        <Route path="/support/" element={<SupportPage />} />
      </Routes>
    </HelmetProvider>
  );
}

export default App;
