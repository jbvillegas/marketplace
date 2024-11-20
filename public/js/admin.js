import {
  fetchNotApprovedProducts,
  fetchApprovedProducts,
} from "./firebaseInit.js";
import {
  doc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { db } from "./firebaseInit.js";

document.addEventListener("DOMContentLoaded", async () => {
  const productsTable = document.querySelector(".table");

  let products = [];
  try {
    products = await fetchNotApprovedProducts();
    renderProductsTable(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    alert("Failed to load products.");
  }

  async function handleApproval(productId, approve) {
    try {
      const productRef = doc(db, "products", productId);
      await updateDoc(productRef, {
        isApproved: approve,
      });

      // Remove row from table
      document.getElementById(`row-${productId}`).remove();

      alert(`Product ${approve ? "approved" : "rejected"} successfully!`);
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product status.");
    }
  }

  async function handleRejection(productId) {
    try {
      const productRef = doc(db, "products", productId);
      await deleteDoc(productRef);

      // Remove row from table
      document.getElementById(`row-${productId}`).remove();

      alert("Product rejected successfully!");
    } catch (error) {
      console.error("Error updating product:", error);
      alert("Failed to update product status.");
    }
  }

  function renderProductsTable(products) {
    const tableBody = document.createElement("tbody");

    products.forEach((product) => {
      const row = document.createElement("tr");
      row.id = `row-${product.id}`;
      row.innerHTML = `
        <td>${product.title}</td>
        <td>${product.author}</td>
        <td>${product.condition}</td>
        <td>$${product.price}</td>
        <td>
          <button onclick="handleApproval('${product.id}', true)" class="btn btn-approve">Approve</button>
          <button onclick="handleRejection('${product.id}', false)" class="btn btn-reject">Reject</button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    // Add headers if they don't exist
    if (!productsTable.querySelector("thead")) {
      const tableHead = document.createElement("thead");
      tableHead.innerHTML = `
        <tr>
          <th>Title</th>
          <th>Author</th>
          <th>Condition</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      `;
      productsTable.appendChild(tableHead);
    }

    productsTable.appendChild(tableBody);
  }

  // Make handleApproval available globally
  window.handleApproval = handleApproval;
  window.handleRejection = handleRejection;

  let approvedBooks = [];
  try {
    approvedBooks = await fetchApprovedProducts();
    renderProductsTable(products);
  } catch (error) {
    console.error("Error fetching products:", error.message);
    alert("Failed to load products.");
  }
  const totalBooks = document.getElementById("total-books");
  totalBooks.innerHTML = `Total Books: ${
    products.length + approvedBooks.length
  }`;
});
