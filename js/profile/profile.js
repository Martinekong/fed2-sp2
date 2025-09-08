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
import { showErrorMessage } from './../utils/validation.js';

const api = new NoroffAPI();
const editProfileBtn = document.getElementById('edit-profile-btn');
const createListingBtn = document.getElementById('create-listing-btn');
const activeBidsContainer = document.getElementById('active-bids-container');
const myListingsContainer = document.getElementById('my-listings-container');

async function renderUser() {
  // show loading ui for profile info
  try {
    const user = await api.profile.view();
    if (user === undefined) {
      window.location.href = './../auth/login/';
      return;
    }
    showUserInfo(user);
  } catch (error) {
    // error handling
    console.error(error.message);
  } finally {
    // hide loading ui
  }
}

function showUserInfo(user) {
  const userBanner = document.getElementById('user-banner');
  const userAvatar = document.getElementById('user-avatar');
  const username = document.getElementById('username');
  const bio = document.getElementById('bio');
  const userCredits = document.getElementById('user-credits');

  userBanner.src = user.banner.url;
  userBanner.alt = user.banner.alt;
  userAvatar.src = user.avatar.url;
  userAvatar.alt = user.avatar.alt;
  username.textContent = user.name;
  bio.textContent = user.bio;
  userCredits.textContent = user.credits;

  editProfileBtn.addEventListener('click', (event) => {
    event.preventDefault();
    showEditProfileOverlay();
  });

  createListingBtn.addEventListener('click', (event) => {
    event.preventDefault();
    showCreateListingOverlay();
  });
}

async function renderUsersBids() {
  // show loading ui for bids user has bid on
  try {
    const bids = await api.profile.bids();

    if (bids.length === 0) {
      return;
    }

    activeBidsContainer.innerHTML = '';

    const finalBids = removeDuplicateBids(bids);

    for (const bid of finalBids) {
      const product = await api.listings.viewSingle(bid.listing.id);
      const card = assembleBidCard(bid, product);
      activeBidsContainer.append(card);
    }
  } catch (error) {
    activeBidsContainer.innerHTML = '';
    const errorContainer = document.getElementById('bids-error-container');
    showErrorMessage(errorContainer, 'Something went wrong. Please try again.');
    console.error(error.message);
  } finally {
    // hide loading ui
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
  // show loading ui for users own listings
  try {
    const listings = await api.profile.listings();

    if (listings.length === 0) {
      return;
    }

    myListingsContainer.innerHTML = '';

    for (const listing of listings) {
      const card = assembleListingCard(listing);
      myListingsContainer.append(card);
    }
  } catch (error) {
    myListingsContainer.innerHTML = '';
    const errorContainer = document.getElementById('listings-error-container');
    showErrorMessage(errorContainer, 'Something went wrong. Please try again.');
    console.error(error.message);
  } finally {
    // hide loading ui
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

// TODO:
// Fix loading ui for renderUser, renderUsersBids and renderUsersListings
// Render wins ?
