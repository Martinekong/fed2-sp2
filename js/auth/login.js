import NoroffAPI from './../api.js';
import { saveToken, saveUser } from '../utils/storage.js';
import { showSuccessMessage, showErrorMessage } from './../utils/validation.js';

const loginForm = document.getElementById('login-form');
const api = new NoroffAPI();

async function loginUser(event) {
  event.preventDefault();

  const submitBtn = event.target.querySelector('button[type="submit"]');

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'logging in...';

    const formData = new FormData(event.target);
    const formFields = Object.fromEntries(formData);

    const user = await api.auth.login(formFields);
    saveToken(user.accessToken);
    saveUser(user.name);

    if (user) {
      const successContainer = document.getElementById('success-container');
      showSuccessMessage(successContainer, 'Login success. Redirecting...');

      setTimeout(() => {
        window.location.href = './../../index.html';
      }, 2000);
    }
  } catch (error) {
    submitBtn.textContent = 'login';
    const errorContainer = document.getElementById('error-container');
    showErrorMessage(errorContainer, `${error.message}.`, true);
  } finally {
    const submitBtn = event.target.querySelector('button[type="submit"]');
    submitBtn.disabled = false;
  }
}

loginForm.addEventListener('submit', loginUser);
