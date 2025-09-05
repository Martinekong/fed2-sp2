import {
  createCard,
  createCardImage,
  createCardInfoDiv,
  createCardInfo,
  createCardBtn,
} from './../utils/cardComponents.js';
import NoroffAPI from './../api.js';

const api = new NoroffAPI();

async function renderUser() {
  const user = await api.profile.view();

  if (user === undefined) {
    window.location.href = './../auth/login/';
    return;
  }

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
}

renderUser();

async function showUserBids() {
  const activeBidsContainer = document.getElementById('active-bids-container');
  const bids = await api.profile.bids();

  if (bids.length === 0) {
    return;
  }

  activeBidsContainer.innerHTML = '';

  for (const bid of bids) {
    const card = await assembleBidCard(bid);
    activeBidsContainer.append(card);
  }
}

async function showUserListings() {
  const myListingsContainer = document.getElementById('my-listings-container');
  const listings = await api.profile.listings();

  if (listings.length === 0) {
    return;
  }

  myListingsContainer.innerHTML = '';

  for (const listing of listings) {
    console.log('this is a single user listing:', listing);
    const card = await assembleListingCard(listing);
    myListingsContainer.append(card);
  }
}

async function assembleBidCard(listing) {
  const href = `./../listing/index.html?id=${listing.listing.id}`;
  const card = createCard(href);
  const image = createCardImage(listing.listing);
  const infoDiv = createCardInfoDiv(listing.listing);
  const yourBid = createCardInfo(listing.amount, 'yourBid');

  const product = await api.listings.viewSingle(listing.listing.id);
  const highestBid = createCardInfo(product, 'latestBid');
  console.log('WORKING HERE:', product);

  const endDate = createCardInfo(listing.listing, 'endDate');
  infoDiv.append(yourBid, highestBid, endDate);
  const button = createCardBtn('Update bid');
  card.append(image, infoDiv, button);
  return card;
}

async function assembleListingCard(listing) {
  const href = `./../listing/index.html?id=${listing.id}`;
  const card = createCard(href);
  const image = createCardImage(listing);
  const infoDiv = createCardInfoDiv(listing);
  const highestBid = createCardInfo(listing, 'latestBid');
  const endDate = createCardInfo(listing, 'endDate');
  infoDiv.append(highestBid, endDate);
  const button = createCardBtn('Edit Listing');

  button.addEventListener('click', (event) => {
    event.preventDefault();
  });

  card.append(image, infoDiv, button);
  return card;
}

showUserBids();
showUserListings();

// TODO:
// Add create listing overlay
// Add edit listing overlay
// Add skeleton loader to banner and avatar/page
// Render wins ?
