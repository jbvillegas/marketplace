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

let totalSales = 1000;
  let pendingOrders = 1000;
  let booksSold = 1000;

  
  window.onload = function() {
    
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(salesCtx, {
      type: 'bar',
      data: {
        labels: ['Total Sales', 'Pending Orders', 'Books Sold'],
        datasets: [{
          label: 'Sales Overview',
          data: [totalSales, pendingOrders, booksSold], 
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(153, 102, 255, 1)'
          ],
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    const booksSoldCtx = document.getElementById('booksSoldChart').getContext('2d');
    const booksSoldChart = new Chart(booksSoldCtx, {
      type: 'doughnut',
      data: {
        labels: ['Fiction', 'Non-Fiction', 'Textbooks'],
        datasets: [{
          label: 'Books Sold Breakdown',
          data: [totalSales, pendingOrders, booksSold], 
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 3
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true }
        }
      }
    });

    document.getElementById('newBookButton').addEventListener('click', function() {
      window.location.href = 'listing.html';
    });

    
    function updateStats() {
      document.getElementById('totalSales').textContent = `Total Sales: $${totalSales}`;
      document.getElementById('pendingOrders').textContent = `Pending Orders: ${pendingOrders}`;
      document.getElementById('booksSold').textContent = `Books Sold: ${booksSold}`;

      
      salesChart.data.datasets[0].data = [totalSales, pendingOrders, booksSold];
      salesChart.update();

      
      booksSoldChart.data.datasets[0].data = [totalSales, pendingOrders, booksSold];
      booksSoldChart.update();
    }

    
    setTimeout(() => {
      totalSales = 500;
      pendingOrders = 20;
      booksSold = 30;
      updateStats();  
    }, 2000); 
  };
