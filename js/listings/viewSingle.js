import { createCountdown } from './../utils/time.js';
import NoroffAPI from './../api.js';
import { getToken } from './../utils/storage.js';

const params = new URLSearchParams(window.location.search);
const listingId = params.get('id');
const api = new NoroffAPI();
const listing = await api.listings.viewSingle(listingId);

const currentBreadcrumb = document.getElementById('current-listing');
currentBreadcrumb.textContent = listing.title;

function renderListing() {
  const title = document.getElementById('listing-title');
  title.textContent = listing.title;

  const imgContainer = document.getElementById('listing-img-container');
  const mainImg = document.createElement('img');
  mainImg.classList.add('rounded-xl', 'h-96', 'w-full', 'object-cover');
  mainImg.src = listing.media[0].url;
  mainImg.alt = listing.media[0].alt;
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

  const description = document.getElementById('listing-description');
  description.textContent = listing.description;

  const latestBid = document.getElementById('latest-bid');
  if (listing._count.bids === 0) {
    latestBid.textContent = 'No bids yet';
  } else {
    latestBid.textContent = listing._count.bids;
  }

  const expiresCountdown = document.getElementById('expires-in');
  expiresCountdown.textContent = new Date(listing.endsAt).toLocaleDateString();
  createCountdown(listing.endsAt, expiresCountdown);
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
    userMessage.textContent = 'You have to be logged in to start bidding.';
    const loginBtn = document.createElement('a');
    loginBtn.href = './../auth/login';
    loginBtn.textContent = 'Login';
    loginBtn.classList.add(
      'bg-primary',
      'text-white',
      'p-4',
      'rounded-2xl',
      'text-center',
      'capitalize',
      'hover:bg-primary-hover',
      'w-60',
      'mt-6',
      'shadow-lg',
    );
    messageDiv.append(userMessage, loginBtn);
    listingContainer.append(messageDiv);
  }
}

renderListing();
isUserLoggedIn();
