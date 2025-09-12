import NoroffAPI from './../api.js';
import {
  createCard,
  createCardImage,
  createCardInfoDiv,
  createCardInfo,
  createCardBtn,
} from './../utils/cardComponents.js';
import { showErrorMessage, showUserMessage } from './../utils/validation.js';
import { showLoadingSpinner, hideLoadingSpinner } from './../utils/loaders.js';

const api = new NoroffAPI();
const listingGrid = document.getElementById('listing-grid');
const loadMoreBtn = document.getElementById('load-more');
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search');
const sortBtn = document.getElementById('sort-btn');
const sortArrow = document.getElementById('sort-arrow');
const errorContainer = document.getElementById('error-container');

let allListings = [];
let sortDirection = 'down';

const PAGE_SIZE = 20;
let visibleCount = PAGE_SIZE;
let currentList = [];

function clearGrid() {
  listingGrid.innerHTML = '';
}

function renderListings(listings) {
  clearGrid();

  if (!listings.length) {
    showUserMessage(listingGrid, 'No listings match your search.');
    loadMoreBtn.classList.add('hidden');
    return;
  }

  const sorted = sortListings(listings, sortDirection);
  const sliced = sorted.slice(0, visibleCount);

  sliced.forEach((listing) => listingGrid.append(assembleListingCard(listing)));
  updateLoadMoreVisibility(sorted);
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
  loadMoreBtn.classList.add('hidden');
  showLoadingSpinner(listingGrid);
  try {
    allListings = await api.listings.viewAll();
    visibleCount = PAGE_SIZE;
    currentList = allListings;
    renderListings(currentList);
  } catch (error) {
    clearGrid();
    showErrorMessage(errorContainer, 'Something went wrong. Please try again.');
    console.error(error.message);
  } finally {
    hideLoadingSpinner(listingGrid);
    loadMoreBtn.classList.remove('hidden');
  }
}

async function renderSearch(query) {
  if (!query) {
    visibleCount = PAGE_SIZE;
    currentList = allListings;
    renderListings(currentList);
    errorContainer.classList.add('hidden');
    return;
  }

  showLoadingSpinner(listingGrid);

  try {
    const results = await api.listings.search(query);

    const ids = new Set(results.map((result) => result.id));
    const filtered = allListings.filter((listing) => ids.has(listing.id));

    visibleCount = PAGE_SIZE;
    currentList = filtered;

    errorContainer.classList.add('hidden');
    renderListings(currentList);
  } catch (error) {
    clearGrid();
    showErrorMessage(errorContainer, 'Search failed. Please try again.');
    console.error(error.message);
  } finally {
    hideLoadingSpinner(listingGrid);
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
  renderListings(currentList);
});

function updateLoadMoreVisibility(list) {
  if (visibleCount >= list.length) {
    loadMoreBtn.classList.add('hidden');
  } else {
    loadMoreBtn.classList.remove('hidden');
  }
}

loadMoreBtn.addEventListener('click', () => {
  visibleCount += PAGE_SIZE;
  renderListings(currentList);
});

loadAll();
