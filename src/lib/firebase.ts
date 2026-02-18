// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Load environment variables for Node.js environment (migration scripts)
if (typeof process !== 'undefined' && process.env) {
    // Running in Node.js (tsx/migration scripts)
    import('dotenv').then(dotenv => dotenv.config());
}

// Helper function to get environment variable from either Vite or Node
const getEnvVar = (key: string): string => {
    // Try Vite environment variables first (browser/dev server)
    if (typeof import.meta !== 'undefined' && import.meta.env) {
        return import.meta.env[key] || '';
    }
    // Fall back to Node.js environment variables (migration scripts)
    if (typeof process !== 'undefined' && process.env) {
        return process.env[key] || '';
    }
    return '';
};

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: getEnvVar('VITE_FIREBASE_API_KEY'),
    authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID'),
    storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET'),
    messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID'),
    appId: getEnvVar('VITE_FIREBASE_APP_ID'),
    measurementId: getEnvVar('VITE_FIREBASE_MEASUREMENT_ID')
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log('🔥 Firebase initialized');
console.log('📦 Project ID:', firebaseConfig.projectId);

// Initialize Analytics (only in browser environment)
let analytics;
if (typeof window !== 'undefined') {
    analytics = getAnalytics(app);
    console.log('📊 Firebase Analytics initialized');
}

// Initialize Firestore
const db = getFirestore(app);
console.log('💾 Firestore connected');

// Initialize Storage
const storage = getStorage(app);
console.log('📦 Storage connected');

export { app, analytics, db, storage };
