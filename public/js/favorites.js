import { db, auth, fetchFavoriteProducts } from "./firebaseInit.js";
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
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
        <button class="btn btn-remove" data-id="${product.id}">Remove from favorites</button>
      </div>
    `;

    productsGrid.appendChild(productCard);
  });

  document.querySelectorAll(".btn-remove").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.dataset.id;
      await removeFavorite(productId);
    });
  });
};

const removeFavorite = async (productId) => {
  const user = auth.currentUser;
  if (!user) {
    alert("Please sign in to remove from favorites.");
    window.location.href = "userLogin.html";
    return;
  }

  try {
    const userId = user.uid;
    const userDocRef = doc(db, `users/${userId}`);
    await updateDoc(userDocRef, {
      favorites: arrayRemove(productId)
    });

    // Remove the product card from the DOM
    const productCard = document.querySelector(`.product-card[data-id="${productId}"]`);
    if (productCard) {
      productCard.remove();
      window.location.reload();
    }
    alert("Product removed from favorites!");
  } catch (error) {
    console.error("Error removing favorite:", error);
    alert("Failed to remove from favorites. Please try again.");
  }
};
