import NoroffAPI from './../api.js';

const loginForm = document.getElementById('login-form');
const api = new NoroffAPI();

async function onLoginSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formFields = Object.fromEntries(formData);

  const user = await api.auth.login(formFields);

  if (user) {
    window.location.href = './../../index.html';
  }
}

loginForm.addEventListener('submit', onLoginSubmit);
