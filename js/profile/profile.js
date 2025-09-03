import NoroffAPI from './../api.js';

const api = new NoroffAPI();

async function renderUser() {
  const user = await api.profile.view();

  if (user === undefined) {
    console.log('user is not logged in');
    return;
  }

  const userBanner = document.getElementById('user-banner');
  const userAvatar = document.getElementById('user-avatar');
  const username = document.getElementById('username');
  const userCredits = document.getElementById('user-credits');

  userBanner.src = user.banner.url;
  userBanner.alt = user.banner.alt;
  userAvatar.src = user.avatar.url;
  userAvatar.alt = user.avatar.alt;
  username.textContent = user.name;
  userCredits.textContent = user.credits;
}

renderUser();

// Fix user not logged in
// Add edit profile overlay
// Add create listing overlay
// Render active bida
// Render my listings
