// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, collection, getDocs,setDoc } from 'firebase/firestore';

// Your Firebase config (copied from Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyAoim48GZV6HRwlmeawr2eJQxMdps--Pd8",
  authDomain: "smart-attendance-b89f0.firebaseapp.com",
  projectId: "smart-attendance-b89f0",
  storageBucket: "smart-attendance-b89f0.firebasestorage.app",
  messagingSenderId: "264451466271",
  appId: "1:264451466271:web:269331c227c6b5864e612a"
};

  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  export { db, doc, getDoc, collection, getDocs,setDoc };
