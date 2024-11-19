import { fetchProducts } from "./firebaseInit.js";

document.addEventListener("DOMContentLoaded", async () => {
  const searchInput = document.querySelector(".search-bar input");
  const searchButton = document.querySelector(".btn-search");
  const categoryButtons = document.querySelectorAll(".category-card");
  const productsGrid = document.querySelector(".listings-grid");


  let products = [];
  try {
    products = await fetchProducts();
  } catch (error) {
    console.error("Error fetching products:", error.message);
    alert("Failed to load products.");
  }

  const renderProducts = (products) => {
    productsGrid.innerHTML = "";
  
    // Limit to 3 products
    const productsToRender = products.slice(0, 3);
  
    productsToRender.forEach((product) => {
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

  const getUrlParams = () => {
    const params = new URLSearchParams(window.location.search);

    return {
      search: params.get("search") || "",
      category: params.get("category") || "",
    };
  };

  const urlParams = getUrlParams();
  if (urlParams.search) {
    searchInput.value = urlParams.search;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    const search = searchInput.value.trim();

    if (search) {
      const searchParams = new URLSearchParams();

      searchParams.set("search", search);
      window.location.href = `products.html?${searchParams.toString()}`;
    } else {
      window.location.href = "products.html";
    }
  };

  searchButton.addEventListener("click", handleSearch);



  // Add event listeners to category buttons and redirect to products.html with the category parameter

  renderProducts(products);
});
