import NoroffAPI from './../api.js';
import {
  showSuccessMessage,
  showErrorMessage,
  addValidationListener,
} from './../utils/validation.js';

const api = new NoroffAPI();

const registerForm = document.getElementById('register-form');
const usernameInput = registerForm.querySelector('input[type="text"]');
const emailInput = registerForm.querySelector('input[type="email"]');
const passwordInput = registerForm.querySelector('input[type="password"]');

addValidationListener(usernameInput);
addValidationListener(emailInput);
addValidationListener(passwordInput);

async function registerUser(event) {
  event.preventDefault();
  const submitBtn = event.target.querySelector('button[type="submit"]');

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'registering...';

    const formData = new FormData(event.target);
    const formFields = Object.fromEntries(formData);

    const user = await api.auth.register(formFields);

    if (user) {
      const successContainer = document.getElementById('success-container');
      showSuccessMessage(successContainer, 'Register success. Redirecting...');

      setTimeout(() => {
        window.location.href = './../../auth/login';
      }, 2000);
    }
  } catch (error) {
    submitBtn.textContent = 'register';
    const errorContainer = document.getElementById('error-container');
    showErrorMessage(errorContainer, `${error.message}.`, true);
  } finally {
    submitBtn.disabled = false;
  }
}

registerForm.addEventListener('submit', registerUser);
