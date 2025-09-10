import NoroffAPI from './../api.js';
import {
  createCard,
  createCardImage,
  createCardInfoDiv,
  createCardInfo,
  createCardBtn,
} from './../utils/cardComponents.js';
import { showEditProfileOverlay } from './updateProfile.js';
import { showCreateListingOverlay } from './../listings/create.js';
import { showEditListingOverlay } from './../listings/edit.js';
import { showErrorMessage, showUserMessage } from './../utils/validation.js';
import { showLoadingSpinner, hideLoadingSpinner } from './../utils/loaders.js';

const api = new NoroffAPI();
const userMedia = document.getElementById('user-media');
const userInfo = document.getElementById('user-info');

async function renderUser() {
  const profileHead = document.getElementById('profile-head');
  showLoadingSpinner(profileHead);
  userMedia.classList.add('hidden');
  userInfo.classList.add('hidden');

  try {
    const user = await api.profile.view();
    if (user === undefined) {
      window.location.href = './../auth/login/';
      return;
    }
    showUserInfo(user);
  } catch (error) {
    userMedia.innerHTML = '';
    userInfo.innerHTML = '';
    showErrorMessage(
      userMedia,
      'Something went wrong when loading profile info. Please try again.',
    );
    console.error(error.message);
  } finally {
    userMedia.classList.remove('hidden');
    userInfo.classList.remove('hidden');
    hideLoadingSpinner(profileHead);
  }
}

function showUserInfo(user) {
  const banner = createUserBanner();
  const avatar = createUserAvatar();
  const username = document.getElementById('username');
  const bio = document.getElementById('bio');
  const userCredits = document.getElementById('user-credits');

  banner.src = user.banner.url;
  banner.alt = user.banner.alt;
  avatar.src = user.avatar.url;
  avatar.alt = user.avatar.alt;
  userMedia.innerHTML = '';
  userMedia.append(banner, avatar);
  username.textContent = user.name;
  bio.textContent = user.bio;
  userCredits.textContent = user.credits;

  const editProfileBtn = document.getElementById('edit-profile-btn');

  editProfileBtn.addEventListener('click', (event) => {
    event.preventDefault();
    showEditProfileOverlay();
  });

  const createListingBtn = document.getElementById('create-listing-btn');

  createListingBtn.addEventListener('click', (event) => {
    event.preventDefault();
    showCreateListingOverlay();
  });
}

function createUserBanner() {
  const banner = document.createElement('img');
  banner.classList.add(
    'object-cover',
    'w-full',
    'h-40',
    'rounded-2xl',
    'shadow-xl',
  );
  return banner;
}

function createUserAvatar() {
  const avatar = document.createElement('img');
  avatar.classList.add(
    'absolute',
    'bottom-0',
    'object-cover',
    '-translate-x-1/2',
    'translate-y-1/4',
    'w-36',
    'h-36',
    'left-1/2',
    'rounded-2xl',
    'shadow-xl',
  );
  return avatar;
}

async function renderUsersBids() {
  const activeBidsContainer = document.getElementById('active-bids-container');
  showLoadingSpinner(activeBidsContainer);
  try {
    const bids = await api.profile.bids();

    if (bids.length === 0) {
      hideLoadingSpinner(activeBidsContainer);
      showUserMessage(activeBidsContainer, 'You have no active bids.');
      return;
    }

    const finalBids = removeDuplicateBids(bids).sort(
      (a, b) => new Date(a.listing.endsAt) - new Date(b.listing.endsAt),
    );

    const products = await Promise.all(
      finalBids.map((bid) => api.listings.viewSingle(bid.listing.id)),
    );

    const cards = finalBids.map((bid, i) => assembleBidCard(bid, products[i]));

    activeBidsContainer.replaceChildren(...cards);
  } catch (error) {
    activeBidsContainer.innerHTML = '';
    const errorContainer = document.getElementById('bids-error-container');
    showErrorMessage(errorContainer, 'Something went wrong. Please try again.');
    console.error(error.message);
  } finally {
    hideLoadingSpinner(activeBidsContainer);
  }
}

function removeDuplicateBids(bids) {
  const map = new Map();

  for (const bid of bids) {
    const listingId = bid.listing.id;
    if (!map.has(listingId) || bid.amount > map.get(listingId).amount) {
      map.set(listingId, bid);
    }
  }
  return Array.from(map.values());
}

function assembleBidCard(listing, product) {
  const href = `./../listing/index.html?id=${listing.listing.id}`;
  const card = createCard(href);
  const image = createCardImage(listing.listing);
  const infoDiv = createCardInfoDiv(listing.listing);
  const yourBid = createCardInfo(listing.amount, 'yourBid');
  const highestBid = createCardInfo(product, 'latestBid');
  const endDate = createCardInfo(listing.listing, 'endDate');
  infoDiv.append(yourBid, highestBid, endDate);
  const button = createCardBtn('Update bid');
  card.append(image, infoDiv, button);
  return card;
}

async function renderUsersListings() {
  const myListingsContainer = document.getElementById('my-listings-container');
  showLoadingSpinner(myListingsContainer);
  try {
    const listings = await api.profile.listings();

    if (listings.length === 0) {
      hideLoadingSpinner(myListingsContainer);
      showUserMessage(myListingsContainer, 'You have no active listings.');
      return;
    }

    listings.sort((a, b) => new Date(a.endsAt) - new Date(b.endsAt));

    const cards = listings.map((listing) => assembleListingCard(listing));

    myListingsContainer.replaceChildren(...cards);
  } catch (error) {
    myListingsContainer.innerHTML = '';
    const errorContainer = document.getElementById('listings-error-container');
    showErrorMessage(errorContainer, 'Something went wrong. Please try again.');
    console.error(error.message);
  } finally {
    hideLoadingSpinner(myListingsContainer);
  }
}

function assembleListingCard(listing) {
  const href = `./../listing/index.html?id=${listing.id}`;
  const card = createCard(href);
  const image = createCardImage(listing);
  const infoDiv = createCardInfoDiv(listing);
  const highestBid = createCardInfo(listing, 'latestBid');
  const endDate = createCardInfo(listing, 'endDate');
  infoDiv.append(highestBid, endDate);
  const editListingBtn = createCardBtn('Edit Listing');

  editListingBtn.addEventListener('click', (event) => {
    event.preventDefault();
    showEditListingOverlay(listing.id);
  });

  card.append(image, infoDiv, editListingBtn);
  return card;
}

renderUser();
renderUsersBids();
renderUsersListings();
