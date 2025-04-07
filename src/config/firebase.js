import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD6U7bu6rt1ibg5m_O0meelPBAzN6IzQmg",
  authDomain: "crm-runner-bot-utvf.firebaseapp.com",
  projectId: "crm-runner-bot-utvf",
  storageBucket: "crm-runner-bot-utvf.firebasestorage.app",
  messagingSenderId: "445207272871",
  appId: "1:445207272871:web:55355ef26d19f75f9faa82",
  measurementId: "G-ND5DVWL2TB",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
