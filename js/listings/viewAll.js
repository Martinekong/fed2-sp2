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

let allListings = [];

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
  listings.forEach((listing) =>
    listingGrid.append(assembleListingCard(listing)),
  );
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

loadAll();

// TODO:
// Add filter functionality
