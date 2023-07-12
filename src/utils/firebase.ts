// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const firebaseConfig = {
  apiKey,
  authDomain: 'cvc-hackathon-frontend.firebaseapp.com',
  projectId: 'cvc-hackathon-frontend',
  storageBucket: 'cvc-hackathon-frontend.appspot.com',
  messagingSenderId: '279822398951',
  appId: '1:279822398951:web:208ef7ec4e3edebfdcf942',
  measurementId: 'G-8BD5J461E7',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);
