// Initialize Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBSHjL6g5rYxi3_zEdQcGj-7Lu7NkHFNjI",
  authDomain: "jdm-marketplace.firebaseapp.com",
  databaseURL: "https://jdm-marketplace-default-rtdb.firebaseio.com",
  projectId: "jdm-marketplace",
  storageBucket: "jdm-marketplace.appspot.com",
  messagingSenderId: "377287456913",
  appId: "1:377287456913:web:494f7509a95dcdc9706730",
  measurementId: "G-K3FSCLF29Z",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

export const fetchApprovedProducts = async () => {
  const products = [];
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    snapshot.forEach((doc) => {
      if (doc.data().isApproved) products.push({ id: doc.id, ...doc.data() });
    });

    console.log("Fetched products:", products);

  } catch (error) {
    console.error("Error fetching products:", error.message);
    alert("Failed to load products. Please try again later.");
  }

  return products;
};

export const fetchNotApprovedProducts = async () => {
  const products = [];
  try {
    const productsRef = collection(db, "products");
    const snapshot = await getDocs(productsRef);

    snapshot.forEach((doc) => {
      if (!doc.data().isApproved) products.push({ id: doc.id, ...doc.data() });
    });

    console.log("Fetched products:", products);

  } catch (error) {
    console.error("Error fetching products:", error.message);
    alert("Failed to load products. Please try again later.");
  }

  return products;
};
