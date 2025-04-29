// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Firebase configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyCNRTvpG9gmIllvnee5PJ2iGUIKbNp6rXs",
  authDomain: "gpdadmin-6591c.firebaseapp.com",
  projectId: "gpdadmin-6591c",
  storageBucket: "gpdadmin-6591c.firebasestorage.app",
  messagingSenderId: "308388643027",
  appId: "1:308388643027:web:af243cf8a5df1f6b6ed426"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
