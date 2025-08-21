import NoroffAPI from './api.js';

const api = new NoroffAPI();

const navMenu = document.getElementById('nav-menu');
const closeMenu = document.getElementById('close-menu');
const openMenu = document.getElementById('open-menu');
const authLink = document.getElementById('auth-link');
const authBtn = document.getElementById('auth-btn');
const credits = document.getElementById('credits');

async function initHeader() {
  const user = await api.profile.view();

  if (user) {
    authLink.textContent = 'logout';
    authBtn.textContent = 'logout';
    authBtn.setAttribute('aria-label', 'logout');
    authLink.addEventListener('click', logoutUser);
    authBtn.addEventListener('click', logoutUser);
    credits.textContent = `Credits: ${user.credits}`;
  } else {
    authLink.textContent = 'login';
    authBtn.textContent = 'login';
    authBtn.setAttribute('aria-label', 'login');
  }
}

initHeader();

function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  credits.textContent = '';
}

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
