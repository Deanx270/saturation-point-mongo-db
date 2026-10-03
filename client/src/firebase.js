import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB4DMLvJyCXCxILXmcXf6Xkl6Nx_ZHZ6KM",
  authDomain: "saturation-point-db.firebaseapp.com",
  projectId: "saturation-point-db",
  storageBucket: "saturation-point-db.firebasestorage.app",
  messagingSenderId: "629342166481",
  appId: "1:629342166481:web:2961b4474dcbe9f9c994f0",
  measurementId: "G-C051N6NG3Q"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
