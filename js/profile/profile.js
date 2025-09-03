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
  const userCredits = document.getElementById('user-credits');

  userBanner.src = user.banner.url;
  userBanner.alt = user.banner.alt;
  userAvatar.src = user.avatar.url;
  userAvatar.alt = user.avatar.alt;
  username.textContent = user.name;
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
    if (!bid.listing) continue;

    const card = await assembleListingCard(bid);
    activeBidsContainer.append(card);
  }
}

async function assembleListingCard(listing) {
  const href = `./../listing/index.html?id=${listing.listing.id}`;
  const card = createCard(href);
  const image = createCardImage(listing.listing);
  const infoDiv = createCardInfoDiv(listing.listing);
  const yourBid = createCardInfo(listing.amount, 'yourBid');
  const highestBidAmount = await findHighestBid(listing.listing.id);
  const highestBid = createCardInfo(highestBidAmount, 'highestBid');
  const endDate = createCardInfo(listing.listing, 'endDate');
  infoDiv.append(yourBid, highestBid, endDate);
  const button = createCardBtn('Update bid');
  card.append(image, infoDiv, button);
  return card;
}

async function findHighestBid(listing) {
  const product = await api.listings.viewSingle(listing);
  const bids = product.bids;
  const highestBid = bids.reduce(
    (max, bid) => {
      return bid.amount > max.amount ? bid : max;
    },
    { amount: 0 },
  );
  console.log('this is the highest bid:', highestBid.amount);
  return highestBid.amount;
}
// Move this function so it can be used for the cards on home and singleListing page

showUserBids();

// Add edit profile overlay
// Add create listing overlay
// Render active bids
// Render my listings
