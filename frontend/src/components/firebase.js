// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAt98OZ7AANAkmO4REus-hMiNbteUqPGck",
  authDomain: "wordle-game-a1a95.firebaseapp.com",
  projectId: "wordle-game-a1a95",
  storageBucket: "wordle-game-a1a95.firebasestorage.app",
  messagingSenderId: "618792504122",
  appId: "1:618792504122:web:189ddd563bbec4e98e1e03",
  measurementId: "G-XGM8CDRBZ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore
const db = getFirestore(app);

export { db };