import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyABJbTMHKy_XpgWFjCFzPf2l6TfpGhTkCE",
  authDomain: "cb-story-app-27012024.firebaseapp.com",
  projectId: "cb-story-app-27012024",
  storageBucket: "cb-story-app-27012024.appspot.com",
  messagingSenderId: "26759520523",
  appId: "1:26759520523:web:a0e7d0f73870a266ac420e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

export { auth, googleAuthProvider, signInWithPopup }; 
