import { fetchApprovedProducts, auth, db } from "./firebaseInit.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import {
  arrayUnion,
  doc,
  updateDoc,
  getDoc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", async () => {
  const productsGrid = document.querySelector(".products-grid");
  const searchInput = document.querySelector(".search-bar input");
  const searchButton = document.querySelector(".btn-search");
  const subjectFilter = document.querySelector(".filter-select:nth-child(1)");
  const priceFilter = document.querySelector(".filter-select:nth-child(2)");
  const conditionFilter = document.querySelector(".filter-select:nth-child(3)");
  const btnRegister = document.querySelector(".btn-register");

  let products = [];
  try {
    products = await fetchApprovedProducts();
  } catch (error) {
    console.error("Error fetching products:", error.message);
    alert("Failed to load products.");
  }

  console.log(products);

  let filteredProducts = [...products];

  const getUrlParams = () => {
    const searchParams = new URLSearchParams(window.location.search);
    console.log("Search Parameters:", Array.from(searchParams.entries()));
    return {
      search: searchParams.get("search") || "",
      subject: searchParams.get("subject") || "",
      price: searchParams.get("price") || "",
      condition: searchParams.get("condition") || "",
    };
  };

  const startFiltersFromUrl = () => {
    const { search, subject, price, condition } = getUrlParams();

    searchInput.value = search;
    subjectFilter.value = subject;
    priceFilter.value = price;
    conditionFilter.value = condition;
  };

  const setNewUrl = () => {
    const searchParams = new URLSearchParams();

    const searchValue = searchInput.value;
    const subjectValue = subjectFilter.value;
    const priceValue = priceFilter.value;
    const conditionValue = conditionFilter.value;

    if (searchValue) searchParams.set("search", searchValue);
    if (subjectValue) searchParams.set("subject", subjectValue);
    if (priceValue) searchParams.set("price", priceValue);
    if (conditionValue) searchParams.set("condition", conditionValue);

    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    window.history.pushState({}, "", newUrl);
  };

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const isAdmin = userDoc.data().isAdmin;

        if (isAdmin) {
          const navLinks = document.querySelector(".nav-links");
          const adminLink = document.createElement("li");
          adminLink.innerHTML = `<a href="admin.html">ADMIN</a>`;
          navLinks.appendChild(adminLink);
        }
      }
    }
  });

  const renderProducts = (products) => {
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
            <div class="btn-group">
              <button class="btn btn-contact">Contact Seller</button>
              <button class="btn btn-favorite" data-id="${product.id}">Add to favorites</button>
            </div>
          </div>
      `;

      productsGrid.appendChild(productCard);
    });
  };

  const filterProducts = () => {
    const searchValue = searchInput.value.toLowerCase();
    const subjectValue = subjectFilter.value.toLowerCase();
    const priceValue = priceFilter.value;
    const conditionValue = conditionFilter.value.toLowerCase();

    filteredProducts = products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(searchValue) ||
        product.author.toLowerCase().includes(searchValue);

      const matchesSubject =
        subjectValue === "" || product.subject.toLowerCase() === subjectValue;

      const matchesPrice =
        priceValue === "" || checkPrice(product.price, priceValue);

      const matchesCondition =
        conditionValue === "" ||
        product.condition.toLowerCase() === conditionValue;

      return (
        matchesSearch && matchesSubject && matchesPrice && matchesCondition
      );
    });

    renderProducts(filteredProducts);
    setNewUrl();
  };

  const checkPrice = (price, range) => {
    switch (range) {
      case "0-25":
        return price >= 0 && price <= 25;
      case "25-50":
        return price > 25 && price <= 50;
      case "50-100":
        return price > 50 && price <= 100;
      case "100+":
        return price > 100;
      default:
        return true;
    }
  };

  searchButton.addEventListener("click", filterProducts);
  searchInput.addEventListener("input", filterProducts);
  subjectFilter.addEventListener("change", filterProducts);
  priceFilter.addEventListener("change", filterProducts);
  conditionFilter.addEventListener("change", filterProducts);

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

  startFiltersFromUrl();
  filterProducts();
  renderProducts(filteredProducts);

  document.querySelectorAll(".btn-favorite").forEach((button) => {
    button.addEventListener("click", async (e) => {
      const productId = e.target.dataset.id;
      await addToFavorites(productId);
    });
  });
});

const addToFavorites = async (productId) => {
  if (!auth.currentUser) {
    alert("Please sign in to add favorites.");
    window.location.href = "userLogin.html";
    return;
  }

  try {
    const userId = auth.currentUser.uid;
    const userDocRef = doc(db, `users/${userId}`);
    await updateDoc(userDocRef, {
      favorites: arrayUnion(productId),
    });

    alert("Product added to favorites!");
  } catch (error) {
    console.error("Error adding to favorites:", error);
    alert("Failed to add to favorites. Please try again.");
  }
};
