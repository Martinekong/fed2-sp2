import NoroffAPI from './../api.js';

const registerForm = document.getElementById('register-form');
const api = new NoroffAPI();

async function onLoginSubmit(event) {
  event.preventDefault();

  const formData = new FormData(event.target);
  const formFields = Object.fromEntries(formData);

  const user = await api.auth.register(formFields);

  if (user) {
    // show some success overlay and a little timeout?
    window.location.href = './../../auth/login';
  }
}

registerForm.addEventListener('submit', onLoginSubmit);
