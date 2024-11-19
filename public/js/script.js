import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

// Check if passwords match
function checkPasswordMatch() {
  const password = document.querySelector('#password').value.trim();
  const confirmPassword = document.querySelector('#confirm-password').value.trim();
  if (password !== confirmPassword) {
    alert('Passwords do not match!');
    return false;
  }
  return true;
}

// Sign-Up Form Submission
document.querySelector('.sign-up form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = e.target.querySelector('input[type="email"]').value.trim();
  const password = e.target.querySelector('input[type="password"]').value.trim();

  if (!checkPasswordMatch()) return;

  if (!email || !password) {
    alert('Please provide a valid email and password.');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log('User signed up:', userCredential.user);
    alert('Registration successful!');
  } catch (error) {
    console.error('Error during sign-up:', error.message);
    alert('Registration failed: ' + error.message);
  }
});

// Sign-In Form Submission
document.querySelector('#loginForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = document.querySelector('#login-email').value.trim();
  const password = document.querySelector('#login-password').value.trim();

  if (!email || !password) {
    alert('Please provide a valid email and password.');
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Logged in as:', userCredential.user.email);
    alert('Sign-In successful!');
  } catch (error) {
    console.error('Error signing in:', error.message);
    alert('Sign-In failed: ' + error.message);
  }
});
