// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA4Cb5SDOQqi8IF6ikQaQPrCbdSQ_Lbfe8",
  authDomain: "think-marathon.firebaseapp.com",
  projectId: "think-marathon",
  storageBucket: "think-marathon.firebasestorage.app",
  messagingSenderId: "550015102782",
  appId: "1:550015102782:web:13afe71578788a5ac4866f",
  measurementId: "G-3FQ05ZY981"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);