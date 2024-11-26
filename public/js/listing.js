import { db, auth } from "./firebaseInit.js";
import { collection, addDoc, getDoc, doc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  const listingForm = document.getElementById('listingForm');
  const submitButton = document.querySelector('.btn-submit');
  const imageInput = document.getElementById('image');
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

  
  imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        imageInput.value = '';
        return;
      }
      
      /*check valid filename*/
      const safeName = file.name.replace(/[^a-z0-9.]/gi, '-').toLowerCase();
      if (safeName !== file.name) {
        alert('Note: The image filename will be saved as: ' + safeName);
      }
    }
  });

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

  listingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!auth.currentUser) {
      alert('Please sign in to list a book');
      window.location.href = 'userLogin.html';
      return;
    }

    try {
      submitButton.disabled = true;
      submitButton.textContent = 'Submitting...';

      /*check image file*/
      const imageFile = imageInput.files[0];
      if (!imageFile) {
        throw new Error('Please select an image file');
      }

      const safeName = imageFile.name.replace(/[^a-z0-9.]/gi, '-').toLowerCase();
      const imagePath = `../assets/images/${safeName}`;

      const formData = {
        title: document.getElementById('title').value.trim(),
        author: document.getElementById('author').value.trim(),
        edition: parseInt(document.getElementById('edition').value),
        price: parseFloat(document.getElementById('price').value),
        subject: document.getElementById('subject').value,
        condition: document.getElementById('condition').value,
        image: imagePath,
        userId: auth.currentUser.uid,
        isApproved: false,
        createdAt: new Date().toISOString(),
        location: 'Campus'
      };

      const docRef = await addDoc(collection(db, "products"), formData);
      console.log("Product submitted with ID:", docRef.id);

      /*show detailed instruuctions*/
      const message = `
Listing submitted successfully!

IMPORTANT: To complete the listing, please:
1. Save your image as: ${safeName}
2. Place it in the project's /public/assets/images/ directory
3. The image will then appear with your listing

Your listing ID is: ${docRef.id}`;

      alert(message);
      listingForm.reset();
      window.location.href = 'products.html';

    } catch (error) {
      console.error('Error submitting listing:', error);
      alert(error.message || 'Failed to submit listing. Please try again.');
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Submit for Review';
    }
  });
});