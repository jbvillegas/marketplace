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