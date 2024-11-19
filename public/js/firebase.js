import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBSHjL6g5rYxi3_zEdQcGj-7Lu7NkHFNjI",
  authDomain: "jdm-marketplace.firebaseapp.com",
  databaseURL: "https://jdm-marketplace-default-rtdb.firebaseio.com",
  projectId: "jdm-marketplace",
  storageBucket: "jdm-marketplace.appspot.com",
  messagingSenderId: "377287456913",
  appId: "1:377287456913:web:494f7509a95dcdc9706730",
  measurementId: "G-K3FSCLF29Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword };
