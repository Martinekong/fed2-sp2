import NoroffAPI from './../api.js';
import { createCountdown, findHighestBid } from './../utils/math.js';
import { showErrorMessage } from './../utils/validation.js';
import { getToken } from './../utils/storage.js';

const params = new URLSearchParams(window.location.search);
const listingId = params.get('id');
const api = new NoroffAPI();

const listingGrid = document.getElementById('listing-grid');
const listingInfo = document.getElementById('listing-info');

async function renderListing() {
  // show loading state

  try {
    const listing = await api.listings.viewSingle(listingId);
    displayBreadcrumbs(listing);
    AssembleListing(listing);
  } catch (error) {
    const errorContainer = document.getElementById('error-container');
    showErrorMessage(errorContainer, 'Something went wrong. Please try again.');
    listingGrid.classList.add('hidden');
    listingInfo.classList.add('hidden');
    console.error(error.message);
  } finally {
    // hide loading state
  }
}

function displayBreadcrumbs(listing) {
  const currentBreadcrumb = document.getElementById('current-listing');
  currentBreadcrumb.textContent = listing.title;
}

function AssembleListing(listing) {
  const title = document.getElementById('listing-title');
  title.textContent = listing.title;

  const description = document.getElementById('listing-description');
  description.textContent = listing.description;

  addLatestBid(listing);
  addExpirationDate(listing);
  addImages(listing);
  addSellerInfo(listing);
  addBidHistory(listing);
}

function addImages(listing) {
  const imgContainer = document.getElementById('listing-img-container');
  const mainImg = document.createElement('img');
  mainImg.classList.add('rounded-xl', 'h-96', 'w-full', 'object-cover');

  if (listing.media[0]) {
    mainImg.src = listing.media[0].url;
    mainImg.alt = listing.media[0].alt;
  } else {
    mainImg.src = './../assets/images/placeholder.jpg';
    mainImg.alt = 'Placeholder image';
  }
  imgContainer.append(mainImg);

  mainImg.onerror = () => {
    mainImg.src = './../assets/images/placeholder.jpg';
    mainImg.alt = 'Placeholder image';
  };

  if (listing.media.length > 1) {
    const thumbContainer = document.createElement('div');
    thumbContainer.classList.add('flex', 'gap-2', 'mt-4', 'overflow-x-auto');

    for (let i = 1; i < listing.media.length; i++) {
      const img = listing.media[i];
      const thumbImg = document.createElement('img');
      thumbImg.classList.add(
        'w-28',
        'h-20',
        'object-cover',
        'rounded-lg',
        'cursor-pointer',
      );
      thumbImg.src = img.url;
      thumbImg.alt = img.alt || `Thumbnail ${i}`;

      thumbImg.addEventListener('click', () => {
        const tempSrc = mainImg.src;
        const tempAlt = mainImg.alt;

        mainImg.src = thumbImg.src;
        mainImg.alt = thumbImg.alt;

        thumbImg.src = tempSrc;
        thumbImg.alt = tempAlt;
      });

      thumbContainer.append(thumbImg);
      imgContainer.append(thumbContainer);
    }
  }
}

function addLatestBid(listing) {
  const latestBid = document.getElementById('latest-bid');
  const highestBid = findHighestBid(listing);
  latestBid.textContent = highestBid;
}

function addExpirationDate(listing) {
  const expiresCountdown = document.getElementById('expires-in');
  if (new Date(listing.endsAt) <= new Date()) {
    const bidBtn = document.getElementById('bid-btn');
    const bidErrorContainer = document.getElementById('bid-error-container');
    showErrorMessage(
      bidErrorContainer,
      'You cannot bid on an expired listing.',
    );
    bidBtn.disabled = 'true';
    expiresCountdown.textContent = 'Expired';
  } else {
    expiresCountdown.textContent = new Date(
      listing.endsAt,
    ).toLocaleDateString();
    createCountdown(listing.endsAt, expiresCountdown);
  }
}

function addSellerInfo(listing) {
  const seller = document.getElementById('seller');
  const sellerInfo = `${listing.seller.name} | ${listing.seller.email}`;
  seller.append(sellerInfo);
}

function addBidHistory(listing) {
  const bidHistoryContainer = document.getElementById('bid-history-container');

  if (listing.bids.length === 0) {
    const message = document.createElement('p');
    message.textContent = 'No bid history available.';
    bidHistoryContainer.append(message);
  } else {
    const bids = [...listing.bids].sort(
      (a, b) => new Date(a.created) - new Date(b.created),
    );

    bids.forEach((bid) => {
      const bidInfo = document.createElement('p');
      bidInfo.textContent = `${bid.bidder.name} | Amount: ${bid.amount}`;
      bidHistoryContainer.append(bidInfo);
    });
  }
}

function isUserLoggedIn() {
  const isUserLoggedIn = getToken();

  if (isUserLoggedIn === null) {
    const bidForm = document.getElementById('bid-form');
    bidForm.classList.add('disabled', 'hidden');

    const listingContainer = document.getElementById('listing-container');

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('flex', 'flex-col');
    const userMessage = document.createElement('p');
    userMessage.textContent = 'You need to be logged in to start bidding.';
    const loginBtn = document.createElement('a');
    loginBtn.href = './../auth/login';
    loginBtn.textContent = 'Login';
    loginBtn.classList.add('primary-btn');
    messageDiv.append(userMessage, loginBtn);
    listingContainer.append(messageDiv);
  }
}

renderListing();
isUserLoggedIn();
