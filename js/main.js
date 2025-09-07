import NoroffAPI from './api.js';
import { getUser } from './utils/storage.js';

const api = new NoroffAPI();

const navMenu = document.getElementById('nav-menu');
const closeMenu = document.getElementById('close-menu');
const openMenu = document.getElementById('open-menu');
const authLink = document.getElementById('auth-link');
const authBtn = document.getElementById('auth-btn');
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
  authLink.textContent = 'login';
  authBtn.textContent = 'login';
  authBtn.setAttribute('aria-label', 'login');
}

function setLoggedInUi(user) {
  authLink.textContent = 'logout';
  authBtn.textContent = 'logout';
  authBtn.setAttribute('aria-label', 'logout');
  authLink.addEventListener('click', logoutUser);
  authBtn.addEventListener('click', logoutUser);
  credits.textContent = `Credits: ${user.credits}`;
}

function logoutUser() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  credits.textContent = '';
  setLoggedInUi();
}

openMenu.addEventListener('click', () => {
  navMenu.classList.add('open');
  closeMenu.classList.remove('hidden');
});

closeMenu.addEventListener('click', () => {
  navMenu.classList.remove('open');
  closeMenu.classList.add('hidden');
});

function getBasePath() {
  const { origin, hostname } = window.location;
  if (hostname.includes('github.io')) {
    return `${origin}/fed2-sp2`;
  }
  console.log('pathname', origin);
  return origin;
}
// Move this so it can be used for other path fixes as well?

async function navigationPathsToProfile() {
  const profileNav = document.getElementById('profile-nav');

  const user = getUser();
  const path = getBasePath();

  if (!user) {
    profileNav.href = `${path}/auth/login`;
    return;
  }

  profileNav.href = `${path}/profile`;
}

// Refactor the navigation paths to include all nav links in header using the basePath.

function showFooterContent() {
  const year = new Date().getFullYear();
  const copyrightEl = document.getElementById('copyright');
  copyrightEl.textContent = `© ${year} Martine Kongsrud`;
}

initHeader();
navigationPathsToProfile();
showFooterContent();
