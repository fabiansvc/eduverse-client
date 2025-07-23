/**
 * @fileOverview Firebase configuration and initialization module.
 * @module firebaseConfig
 */

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

/**
 * Firebase configuration object.
 * @type {object}
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

/**
 * Initialize Firebase app.
 * @constant {object}
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase authentication instance.
 * @constant {object}
 */
const auth = getAuth(app);

/**
 * Firebase Firestore instance.
 * @constant {object}
 */
const db = getFirestore(app);

export { auth, db };
