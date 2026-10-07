import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if credentials are provided and not default placeholders
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'your_api_key_here' &&
  firebaseConfig.projectId !== 'your_project_id'
);

let app = null;
let auth = null;
let db = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
} else {
  console.warn(
    'Firebase configuration is missing or incomplete. Please create a .env.local file with your Firebase credentials.'
  );
}

/**
 * Translates Firebase error codes into human-friendly messages
 */
export function getFriendlyAuthErrorMessage(errorCode, originalMessage = '') {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Please provide a valid email address.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
      return 'No account exists with this email address.';
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account already exists with this email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/network-request-failed':
      return 'Network connection error. Please verify your internet connection.';
    case 'auth/too-many-requests':
      return 'Access temporarily blocked due to too many attempts. Please try again later.';
    case 'auth/missing-password':
      return 'Please enter your password.';
    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in Firebase Console. Please enable it in Authentication > Sign-in method.';
    case 'auth/configuration-not-found':
      return 'Authentication is not yet configured for this Firebase project. Please enable Email/Password provider in the Firebase Console.';
    default:
      return originalMessage || errorCode || 'An unexpected error occurred. Please try again.';
  }
}

export { app, auth, db };
