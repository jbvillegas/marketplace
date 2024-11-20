import { db, auth, fetchFavoriteProducts } from "./firebaseInit.js";
import {
  doc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", async () => {

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      try {
        const userId = user.uid;
        const userDocRef = doc(db, `users/${userId}`);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const favoriteProductIds = userDoc.data().favorites || [];
          const favoriteProducts = await fetchFavoriteProducts(
            favoriteProductIds
          );
          renderProducts(favoriteProducts);
        } else {
          console.error("User document not found");
          alert("Failed to load favorites. Please try again.");
        }
      } catch (error) {
        console.error("Error fetching favorites:", error);
        alert("Failed to load favorites. Please try again.");
      }
    } else {
      alert("Please sign in to view your favorites.");
      window.location.href = "userLogin.html";
    }
  });
});

const renderProducts = (products) => {
  const productsGrid = document.querySelector(".products-grid");

  productsGrid.innerHTML = "";
  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
      <div class="product-image">
        <img src="${product.image}" alt="${product.title}" />
        <span class="condition">${product.condition}</span>
      </div>
      <div class="product-info">
        <h3>${product.title}</h3>
        <p class="author">${product.author}</p>
        <p class="edition">${product.edition}th Edition</p>
        <div class="product-meta">
          <p class="price">${product.price}$</p>
          <p class="location">${product.location}</p>
        </div>
        <button class="btn btn-contact">Contact Seller</button>
      </div>
    `;

    productsGrid.appendChild(productCard);
  });
};
