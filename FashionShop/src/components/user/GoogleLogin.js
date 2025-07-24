import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCMHircDH277UAzPp3gj65uvIyG1sUGh0g",
  authDomain: "login-f707f.firebaseapp.com",
  projectId: "login-f707f",
  storageBucket: "login-f707f.appspot.com",
  messagingSenderId: "731849237461",
  appId: "1:731849237461:web:13e873fb5fd5e74ba2135c"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';

const googleProvider = new GoogleAuthProvider();

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}
