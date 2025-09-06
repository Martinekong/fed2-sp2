import NoroffAPI from './../api.js';
import { showSuccessMessage } from './../utils/validation.js';

const loginForm = document.getElementById('login-form');
const api = new NoroffAPI();

async function onLoginSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formFields = Object.fromEntries(formData);

  const user = await api.auth.login(formFields);

  if (user) {
    const successContainer = document.getElementById('success-container');
    showSuccessMessage(successContainer, 'Login success. Redirecting...');

    setTimeout(() => {
      window.location.href = './../../index.html';
    }, 2000);
  }
}

loginForm.addEventListener('submit', onLoginSubmit);
