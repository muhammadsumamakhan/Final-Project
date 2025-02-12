import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5fvUZEcxa352ulHqarLIq17tKVnQzMDQ",
  authDomain: "react-project-d8655.firebaseapp.com",
  projectId: "react-project-d8655",
  storageBucket: "react-project-d8655.firebasestorage.app",
  messagingSenderId: "558895599377",
  appId: "1:558895599377:web:84bc7625aa371910f706b0",
  measurementId: "G-2V2GMRL3PD"
};


export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
