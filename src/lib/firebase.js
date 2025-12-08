// src/lib/firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
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

export { app, analytics };

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
