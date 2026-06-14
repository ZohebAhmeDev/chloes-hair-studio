// ── Firebase Integration ───────────────────────────────────────────
// HOW TO CONNECT:
//  1. Go to https://console.firebase.google.com
//  2. Create a project (e.g. "chloes-hair-studio")
//  3. Add a Web App — copy the firebaseConfig object
//  4. Enable Firestore Database (Start in test mode initially)
//  5. Replace the placeholder values below with your real config
// ──────────────────────────────────────────────────────────────────

// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  where,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// Import config from separate file
import { firebaseConfig } from './firebase-config.js';

let db = null;
let firebaseReady = false;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  firebaseReady = true;
  console.log("✅ Firebase connected");
} catch (err) {
  console.warn("⚠️ Firebase not configured yet.", err.message);
}

// Your existing functions...
export async function saveBooking(data) {
  if (!firebaseReady) return new Promise(resolve => setTimeout(resolve, 1000));
  return await addDoc(collection(db, "bookings"), {
    ...data,
    createdAt: serverTimestamp(),
    status: "pending"
  });
}

export async function saveReview(data) {
  if (!firebaseReady) return new Promise(resolve => setTimeout(resolve, 1000));
  return await addDoc(collection(db, "reviews"), {
    ...data,
    createdAt: serverTimestamp(),
    approved: false
  });
}

export async function loadReviews() {
  if (!firebaseReady) return [];
  try {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.warn("Could not load reviews:", err.message);
    return [];
  }
}

// NEW: Admin functions
export async function loadAllBookings() {
  if (!firebaseReady) return [];
  const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function updateBookingStatus(id, status) {
  if (!firebaseReady) return;
  await updateDoc(doc(db, "bookings", id), { status, updatedAt: serverTimestamp() });
}

export async function deleteBooking(id) {
  if (!firebaseReady) return;
  await deleteDoc(doc(db, "bookings", id));
}

export async function loadAllReviews() {
  if (!firebaseReady) return [];
  const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

export async function approveReview(id) {
  if (!firebaseReady) return;
  await updateDoc(doc(db, "reviews", id), { approved: true, approvedAt: serverTimestamp() });
}

export async function deleteReview(id) {
  if (!firebaseReady) return;
  await deleteDoc(doc(db, "reviews", id));
}
