// src/lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

// Prefer Vite env config (what you already had)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
};

// Initialize app only once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Optional analytics, only in browser and if supported
let analytics;
if (typeof window !== "undefined") {
  isSupported()
    .then((ok) => {
      if (ok) {
        analytics = getAnalytics(app);
      }
    })
    .catch(() => {
      // ignore analytics errors in unsupported envs
    });
}

// Configure Google provider so it always shows the account chooser
// NEW: Google provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export { app, analytics, googleProvider };

export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

// Login helper, same semantics as old src/firebase.js
export async function signIn(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true;
  } catch (error) {
    if (
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found"
    ) {
      alert("Incorrect Email address or Password");
    } else {
      alert("Error: " + error.message);
    }
    return false;
  }
}

// Sign up helper, same as old file
export async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await sendEmailVerification(user);

    return userCredential;
  } catch (error) {
    console.error("Error during sign up:", error.message);
    alert("Error during sign up: " + error.message);
  }
}

/** NEW: Google sign in for web */
// NEW: start Google sign in in the SAME TAB using redirect
export async function startGoogleLoginRedirect(targetPath = "/ai/library") {
  // Remember where we want to go after auth finishes
  console.log("[startGoogleLoginRedirect] origin:", window.location.origin);
  console.log("[startGoogleLoginRedirect] path:", window.location.pathname);
  console.log("[startGoogleLoginRedirect] targetPath:", targetPath);
  sessionStorage.setItem("postAuthRedirectPath", targetPath);
  await signInWithRedirect(auth, googleProvider);
}

/** NEW: Google sign in for web */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // result.user is the Firebase user object
    return result.user;
  } catch (error) {
    console.error("Google sign in error:", error);

    // Optional: handle common cases
    if (error.code === "auth/popup-closed-by-user") {
      // user closed the Google window, no need to alert
      return null;
    }

    alert("Could not sign in with Google: " + error.message);
    throw error;
  }
}
