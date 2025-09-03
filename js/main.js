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
  navMenu.classList.add('open');
  closeMenu.classList.remove('hidden');
});

closeMenu.addEventListener('click', () => {
  navMenu.classList.remove('open');
  closeMenu.classList.add('hidden');
});

function showFooterContent() {
  const year = new Date().getFullYear();
  const copyrightEl = document.getElementById('copyright');
  copyrightEl.textContent = `© ${year} Martine Kongsrud`;
}

showFooterContent();

async function navigationPathsToProfile() {
  const profileNav = document.getElementById('profile-nav');

  const user = await api.profile.view();

  if (!user) {
    profileNav.href = `${window.location.origin}/auth/login`;
    return;
  }

  if (window.location.pathname.includes('profile')) {
    profileNav.href = './';
  } else if (window.location.pathname.includes('auth')) {
    profileNav.href = './../../profile';
  } else if (
    window.location.pathname.includes('listing') ||
    window.location.pathname.includes('about')
  ) {
    profileNav.href = './../profile';
  } else {
    profileNav.href = './profile';
  }
}

navigationPathsToProfile();
