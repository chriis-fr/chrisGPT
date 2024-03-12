// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "@firebase/auth";
import { getDatabase } from 'firebase/database'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUH83UnsthM8MBg40f8EENfE_hQ3-KLr4",
  authDomain: "chrisgpt-67e75.firebaseapp.com",
  projectId: "chrisgpt-67e75",
  storageBucket: "chrisgpt-67e75.appspot.com",
  messagingSenderId: "989453497791",
  appId: "1:989453497791:web:df81b91ea8d5fb48fe9d0a",
  measurementId: "G-6YJGX3Z4XE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const database = getDatabase(app)

export { auth, database}