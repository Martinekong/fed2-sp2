import NoroffAPI from './../api.js';
import {
  createCard,
  createCardImage,
  createCardInfoDiv,
  createCardInfo,
  createCardBtn,
} from './../utils/cardComponents.js';

const api = new NoroffAPI();
const listingGrid = document.getElementById('listing-grid');

async function renderListings() {
  const listings = await api.listings.viewAll();

  listings.forEach((listing) => {
    const card = assembleListingCard(listing);
    listingGrid.append(card);
  });
}

function assembleListingCard(listing) {
  const href = `./listing/index.html?id=${listing.id}`;
  const card = createCard(href);
  const image = createCardImage(listing);
  const infoDiv = createCardInfoDiv(listing);
  const latestBid = createCardInfo(listing, 'latestBid');
  const endDate = createCardInfo(listing, 'endDate');
  infoDiv.append(latestBid, endDate);
  const button = createCardBtn('bid on it');
  card.append(image, infoDiv, button);
  return card;
}

renderListings();

const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');

async function performSearch(query) {
  if (!query) {
    const all = await api.listings.viewAll();
    listingGrid.innerHTML = '';
    all.forEach((listing) => {
      const card = assembleListingCard(listing);
      listingGrid.append(card);
    });
    return;
  }

  const listings = await api.listings.search(query);
  const activeListings = listings.filter(
    (listing) => new Date(listing.endsAt) > new Date(),
  );

  listingGrid.innerHTML = '';

  if (activeListings.length > 0) {
    activeListings.forEach((listing) => {
      const card = assembleListingCard(listing);
      listingGrid.append(card);
    });
  } else {
    const msg = document.createElement('p');
    msg.textContent = 'No listings match your search.';
    listingGrid.append(msg);
  }
}

searchForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  performSearch(query);
});

searchBtn.addEventListener('click', async (event) => {
  event.preventDefault();
  const query = searchInput.value.trim();
  performSearch(query);
});
