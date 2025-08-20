import { getToken } from './utils/storage.js';

const navMenu = document.getElementById('nav-menu');
const closeMenu = document.getElementById('close-menu');
const openMenu = document.getElementById('open-menu');
const loginLink = document.getElementById('login-link');
const logoutLink = document.getElementById('logout-link');
const loginBtn = document.getElementById('login-btn');
const logoutBtn = document.getElementById('logout-btn');
const credits = document.getElementById('credits');

openMenu.addEventListener('click', () => {
  navMenu.classList.remove('opacity-0', 'pointer-events-none');
  navMenu.classList.add('opacity-100', 'pointer-events-auto');

  closeMenu.classList.remove('hidden');
});

closeMenu.addEventListener('click', () => {
  navMenu.classList.add('opacity-0', 'pointer-events-none');
  navMenu.classList.remove('opacity-100', 'pointer-events-auto');

  closeMenu.classList.add('hidden');
});

const user = getToken();

if (user) {
  loginLink.classList.add('hidden');
  logoutBtn.classList.add('md:block');
  credits.textContent = `Credits:`;
  // Have to add the actual credits for the user after api setup
} else {
  logoutLink.classList.add('hidden');
  loginBtn.classList.add('md:block');
}

function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  credits.textContent = '';
}

logoutBtn.addEventListener('click', logoutUser);
logoutLink.addEventListener('click', logoutUser);
