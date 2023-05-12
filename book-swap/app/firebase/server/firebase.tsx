// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "@firebase/auth";
import { getFirestore } from "firebase/firestore"; // Add this import

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuqw-UTejB_XRZmHTXRbL656RUadWuZ5Q",
  authDomain: "exam-project-89444.firebaseapp.com",
  projectId: "exam-project-89444",
  storageBucket: "exam-project-89444.appspot.com",
  messagingSenderId: "113143863692",
  appId: "1:113143863692:web:c079558dc6278e57291ea9",
  measurementId: "G-02905TKGNY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Firebase Firestore and get a reference to the service
export const firestore = getFirestore(app); // Add this line
