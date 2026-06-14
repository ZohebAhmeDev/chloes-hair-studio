// ── Firebase Integration ───────────────────────────────────────────
// HOW TO CONNECT:
//  1. Go to https://console.firebase.google.com
//  2. Create a project (e.g. "chloes-hair-studio")
//  3. Add a Web App — copy the firebaseConfig object
//  4. Enable Firestore Database (Start in test mode initially)
//  5. Replace the placeholder values below with your real config
// ──────────────────────────────────────────────────────────────────

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// ── YOUR CONFIG (replace with values from Firebase console) ────────
const firebaseConfig = {
  apiKey: "AIzaSyD7rlKLVa823PXFQRUx0X8fXUrQxuBw7Eg",
  authDomain: "chloes-hair-studio.firebaseapp.com",
  projectId: "chloes-hair-studio",
  storageBucket: "chloes-hair-studio.firebasestorage.app",
  messagingSenderId: "495588109414",
  appId: "1:495588109414:web:10815ad3d7c858388b51a7",
  measurementId: "G-L8YK901BVP"
};
// ──────────────────────────────────────────────────────────────────

let db = null;
let firebaseReady = false;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  firebaseReady = true;
  console.log("✅ Firebase connected");
} catch (err) {
  console.warn("⚠️ Firebase not configured yet. Running in demo mode.", err.message);
}

// ── Save a booking to Firestore ────────────────────────────────────
export async function saveBooking(data) {
  if (!firebaseReady) {
    // Demo mode: simulate success after 1 second
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
  return await addDoc(collection(db, "bookings"), {
    ...data,
    createdAt: serverTimestamp(),
    status: "pending"
  });
}

// ── Save a review to Firestore ─────────────────────────────────────
export async function saveReview(data) {
  if (!firebaseReady) {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
  return await addDoc(collection(db, "reviews"), {
    ...data,
    createdAt: serverTimestamp(),
    approved: false   // set to true in Firebase console to show on site
  });
}

// ── Load approved reviews from Firestore ──────────────────────────
export async function loadReviews() {
  if (!firebaseReady) return [];
  try {
    const q = query(
      collection(db, "reviews"),
      orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(r => r.approved);   // only show approved reviews
  } catch (err) {
    console.warn("Could not load reviews:", err.message);
    return [];
  }
}
