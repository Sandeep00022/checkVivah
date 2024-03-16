// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "photo-video-uploader.firebaseapp.com",
  projectId: "photo-video-uploader",
  storageBucket: "photo-video-uploader.appspot.com",
  messagingSenderId: "767309178017",
  appId: "1:767309178017:web:0bdcbde78d0991a4cc7ce0",
  measurementId: "G-FJWS1TD8TG",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
