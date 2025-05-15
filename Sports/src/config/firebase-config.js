// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDd36ys-RUMr5x0Bv-095y_FItCQROwq1o",
  authDomain: "sports-forum-fead9.firebaseapp.com",
  databaseURL: "https://sports-forum-fead9-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "sports-forum-fead9",
  storageBucket: "sports-forum-fead9.firebasestorage.app",
  messagingSenderId: "198471540882",
  appId: "1:198471540882:web:07f557e17b3e80ece5c64b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app)
export const auth = getAuth(app)

