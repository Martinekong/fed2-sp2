import NoroffAPI from './../api.js';
import {
  createCard,
  createCardImage,
  createCardInfoDiv,
  createCardInfo,
  createCardBtn,
} from './../utils/cardComponents.js';
import { showErrorMessage } from './../utils/validation.js';

const api = new NoroffAPI();
const listingGrid = document.getElementById('listing-grid');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search');
const sortBtn = document.getElementById('sort-btn');
const sortArrow = document.getElementById('sort-arrow');

let allListings = [];
let sortDirection = 'down';

function clearGrid() {
  listingGrid.innerHTML = '';
}

function renderListings(listings) {
  clearGrid();
  if (!listings.length) {
    const p = document.createElement('p');
    p.textContent = 'No listings match your search.';
    listingGrid.append(p);
    return;
  }
  const sorted = sortListings(listings, sortDirection);
  sorted.forEach((listing) => listingGrid.append(assembleListingCard(listing)));
}

export function assembleListingCard(listing) {
  const href = `./listing/index.html?id=${listing.id}`;
  const card = createCard(href);
  const image = createCardImage(listing);
  const info = createCardInfoDiv(listing);
  const latestBid = createCardInfo(listing, 'latestBid');
  const endDate = createCardInfo(listing, 'endDate');
  info.append(latestBid, endDate);
  const btn = createCardBtn('bid on it');
  card.append(image, info, btn);
  return card;
}

async function loadAll() {
  try {
    allListings = await api.listings.viewAll();
    console.log(allListings);
    renderListings(allListings);
  } catch (error) {
    const errorContainer = document.getElementById('error-container');
    showErrorMessage(errorContainer, 'Something went wrong. Please try again.');
    console.error(error.message);
  }
}

async function renderSearch(query) {
  const errorContainer = document.getElementById('error-container');

  if (!query) {
    renderListings(allListings);
    errorContainer.classList.add('hidden');

    return;
  }
  try {
    const results = await api.listings.search(query);
    const ids = new Set(results.map((result) => result.id));
    const filtered = allListings.filter((listing) => ids.has(listing.id));
    errorContainer.classList.add('hidden');
    renderListings(filtered);
  } catch (error) {
    clearGrid();
    showErrorMessage(errorContainer, 'Search failed. Please try again.');
    console.error(error.message);
  }
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  renderSearch(searchInput.value.trim());
});

function sortListings(listings, direction = 'down') {
  return [...listings].sort((a, b) => {
    const aTime = new Date(a.endsAt).getTime();
    const bTime = new Date(b.endsAt).getTime();

    if (direction === 'down') {
      return aTime - bTime;
    } else {
      return bTime - aTime;
    }
  });
}

sortBtn.addEventListener('click', () => {
  if (sortDirection === 'down') {
    sortDirection = 'up';
    sortArrow.textContent = 'arrow_upward';
  } else {
    sortDirection = 'down';
    sortArrow.textContent = 'arrow_downward';
  }

  const query = searchInput.value.trim();
  if (query) {
    renderSearch(query);
  } else {
    renderListings(allListings);
  }
});

loadAll();
