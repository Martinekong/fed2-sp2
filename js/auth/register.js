import { showSuccessMessage, showErrorMessage } from './../utils/validation.js';
import NoroffAPI from './../api.js';

const registerForm = document.getElementById('register-form');
const api = new NoroffAPI();

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
