import NoroffAPI from './api.js';
import { getUser } from './utils/storage.js';
import { getBasePath } from './utils/constants.js';

const api = new NoroffAPI();

const navMenu = document.getElementById('nav-menu');
const closeMenu = document.getElementById('close-menu');
const openMenu = document.getElementById('open-menu');
const authNav = document.getElementById('auth-nav');
const authIcon = document.getElementById('auth-icon');
const credits = document.getElementById('credits');

async function initHeader() {
  try {
    const isUserLoggedIn = getUser();

    if (isUserLoggedIn) {
      const user = await api.profile.view();
      setLoggedInUi(user);
    } else {
      setLoggedOutUi();
    }
  } catch (error) {
    console.error(error.message);
  }
}

function setLoggedOutUi() {
  authNav.textContent = 'login';
  authIcon.textContent = 'login';
  authIcon.setAttribute('aria-label', 'login');
}

function setLoggedInUi(user) {
  authNav.textContent = 'logout';
  authIcon.textContent = 'logout';
  authIcon.setAttribute('aria-label', 'logout');
  authNav.addEventListener('click', logoutUser);
  authIcon.addEventListener('click', logoutUser);
  credits.textContent = `Credits: ${user.credits}`;
}

function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  credits.textContent = '';
  setLoggedOutUi();
}

openMenu.addEventListener('click', () => {
  navMenu.classList.add('open');
  closeMenu.classList.remove('hidden');
});

closeMenu.addEventListener('click', () => {
  navMenu.classList.remove('open');
  closeMenu.classList.add('hidden');
});

function setNavLinks() {
  const path = getBasePath();
  const headerLogo = document.getElementById('header-logo');
  const footerLogo = document.getElementById('footer-logo');
  const listings = document.getElementById('listings-nav');
  const about = document.getElementById('about-nav');
  const profile = document.getElementById('profile-nav');
  const authBtn = document.getElementById('auth-btn');

  headerLogo.href = `${path}/`;
  footerLogo.href = `${path}/`;
  listings.href = `${path}/`;
  about.href = `${path}/about/`;
  authNav.href = `${path}/auth/login/`;
  authBtn.href = `${path}/auth/login/`;

  const user = getUser();

  if (!user) {
    profile.href = `${path}/auth/login`;
    return;
  }

  profile.href = `${path}/profile`;
}

function showFooterContent() {
  const year = new Date().getFullYear();
  const copyrightEl = document.getElementById('copyright');
  copyrightEl.textContent = `© ${year} Martine Kongsrud`;
}

initHeader();
setNavLinks();
showFooterContent();
