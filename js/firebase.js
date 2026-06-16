// ── Firebase Integration ───────────────────────────────────────────
// HOW TO CONNECT:
//  1. Go to https://console.firebase.google.com
//  2. Create a project (e.g. "chloes-hair-studio")
//  3. Add a Web App — copy the firebaseConfig object
//  4. Enable Firestore Database (Start in test mode initially)
//  5. Replace the placeholder values below with your real config
// ──────────────────────────────────────────────────────────────────

// firebase.js
// firebase.js - COMPLETE VERSION with all admin functions
// firebase.js - COMPLETE FILE with everything inside
// firebase.js - COMPLETE WORKING VERSION
// firebase.js - COMPLETE FILE with everything inside
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

// YOUR FIREBASE CONFIG - directly in this file
const firebaseConfig = {
  apiKey: "AIzaSyD7rlKLVa823PXFQRUx0X8fXUrQxuBw7Eg",
  authDomain: "chloes-hair-studio.firebaseapp.com",
  projectId: "chloes-hair-studio",
  storageBucket: "chloes-hair-studio.firebasestorage.app",
  messagingSenderId: "495588109414",
  appId: "1:495588109414:web:10815ad3d7c858388b51a7",
  measurementId: "G-L8YK901BVP"
};

let db = null;
let firebaseReady = false;

try {
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  firebaseReady = true;
  console.log("✅ Firebase connected");
} catch (err) {
  console.warn("⚠️ Firebase error:", err.message);
}

// ── Save a booking ────────────────────────────────────
export async function saveBooking(data) {
  if (!firebaseReady) {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
  return await addDoc(collection(db, "bookings"), {
    ...data,
    createdAt: serverTimestamp(),
    status: "pending"
  });
}

// ── Save a review ─────────────────────────────────────
export async function saveReview(data) {
  if (!firebaseReady) {
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
  return await addDoc(collection(db, "reviews"), {
    ...data,
    createdAt: serverTimestamp(),
    approved: false
  });
}

// ── Load approved reviews for website ─────────────────
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
      .filter(r => r.approved === true);
  } catch (err) {
    console.warn("Could not load reviews:", err.message);
    return [];
  }
}

// ═══════════════════════════════════════════════════════
// ║  ADMIN FUNCTIONS                                     ║
// ═══════════════════════════════════════════════════════

export async function loadAllBookings() {
  if (!firebaseReady) return [];
  try {
    const q = query(collection(db, "bookings"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error loading bookings:", err);
    return [];
  }
}

export async function updateBookingStatus(id, status) {
  if (!firebaseReady) return;
  await updateDoc(doc(db, "bookings", id), { 
    status: status, 
    updatedAt: serverTimestamp() 
  });
}

export async function deleteBooking(id) {
  if (!firebaseReady) return;
  await deleteDoc(doc(db, "bookings", id));
}

export async function loadAllReviews() {
  if (!firebaseReady) return [];
  try {
    const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error("Error loading reviews:", err);
    return [];
  }
}

export async function approveReview(id) {
  if (!firebaseReady) return;
  await updateDoc(doc(db, "reviews", id), { 
    approved: true, 
    approvedAt: serverTimestamp() 
  });
}

export async function deleteReview(id) {
  if (!firebaseReady) return;
  await deleteDoc(doc(db, "reviews", id));
}
