import { db, auth, fetchFavoriteProducts } from "./firebaseInit.js";
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import {
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  const btnRegister = document.querySelector(".btn-register");

  if (auth.currentUser) {
    btnRegister.innerHTML = "Sign Out";
    btnRegister.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        await signOut(auth);
        window.location.href = "index.html";
        alert("You have been signed out.");
      } catch (error) {
        console.error("Error signing out:", error);
        alert("Failed to sign out. Please try again.");
      }
    });
  }

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

          const isAdmin = userDoc.data().isAdmin;

          if (isAdmin) {
            const navLinks = document.querySelector(".nav-links");
            const adminLink = document.createElement("li");
            adminLink.innerHTML = `<a href="admin.html">ADMIN</a>`;
            navLinks.appendChild(adminLink);
          }
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
    productCard.setAttribute("data-id", product.id); // Ensure data-id is set correctly
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
        <div class="btn-group">
              <button class="btn btn-contact">Contact Seller</button>
              <button class="btn btn-favorite" data-id="${product.id}">Remove from favorites</button>
            </div>      
        </div>
    `;

    productsGrid.appendChild(productCard);
  });

  // Add event listeners to remove buttons
  document.querySelectorAll(".btn-favorite").forEach((button) => {
    button.addEventListener("click", async (event) => {
      const productId = event.target.dataset.id;
      await removeFavorite(productId);
    });
  });
};

const removeFavorite = async (productId) => {
  const user = auth.currentUser;

  try {
    const userId = user.uid;
    const userDocRef = doc(db, `users/${userId}`);
    await updateDoc(userDocRef, {
      favorites: arrayRemove(productId),
    });

    // Remove the product card from the DOM
    const productCard = document.querySelector(
      `.product-card[data-id="${productId}"]`
    );
    if (productCard) {
      productCard.remove();
    }

    alert("Product removed from favorites!");
  } catch (error) {
    console.error("Error removing favorite:", error);
    alert("Failed to remove from favorites. Please try again.");
  }
};
