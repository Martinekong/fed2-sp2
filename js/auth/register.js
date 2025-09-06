import { showSuccessMessage } from './../utils/validation.js';
import NoroffAPI from './../api.js';

const registerForm = document.getElementById('register-form');
const api = new NoroffAPI();

async function onLoginSubmit(event) {
  event.preventDefault();

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
}

registerForm.addEventListener('submit', onLoginSubmit);
