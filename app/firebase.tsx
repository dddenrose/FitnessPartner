import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

export const firebaseConfig = {
  apiKey: "AIzaSyDTiHOeqQo7TJ7rAzvKXuIhjqgm9ALC3_A",
  authDomain: "neo-fitnesspartner.firebaseapp.com",
  projectId: "neo-fitnesspartner",
  storageBucket: "neo-fitnesspartner.firebasestorage.app",
  messagingSenderId: "736896342934",
  appId: "1:736896342934:web:1ba70143dd897bc4cc5bb7",
  measurementId: "G-HY0JG2S7V5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
