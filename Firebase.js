// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyDYV8Y0ag7fe3an8veFNNyGlqqSaSShNX0",
  authDomain: "ws-quiver.firebaseapp.com",
  projectId: "ws-quiver",
  storageBucket: "ws-quiver.appspot.com",
  messagingSenderId: "694344473866",
  appId: "1:694344473866:web:76dfd2ab1813696aa12ef3",
  measurementId: "G-JF5G292553",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app, firebaseConfig };
