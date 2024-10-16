// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANMkkhlfmrGeBSRXjRUTb13pRbXyqvlCE",
  authDomain: "vetcationapp.firebaseapp.com",
  projectId: "vetcationapp",
  storageBucket: "vetcationapp.appspot.com",
  messagingSenderId: "505953594291",
  appId: "1:505953594291:web:00bf29026f5453ce72b9c6",
  measurementId: "G-LPGD1TB9L5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app);

export { auth, firestore, storage };

// SignIn function
export async function signIn(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return true; // Return true on successful sign-in
  } catch (error) {
    if (
      error.code === "auth/wrong-password" ||
      error.code === "auth/user-not-found"
    ) {
      alert("Incorrect Email address or Password");
    } else {
      alert("Error: " + error.message);
    }
    return false; // Return false if there's an error
  }
}

// SignUp function
export async function signUp(email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Send verification email
    await sendEmailVerification(user);

    return userCredential;
  } catch (error) {
    console.error("Error during sign up:", error.message);
    alert("Error during sign up: " + error.message);
  }
}
