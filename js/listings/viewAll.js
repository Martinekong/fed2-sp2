import {} from '../utils/cardComponents.js';
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
    assembleListingCard(listing);
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
  listingGrid.append(card);
}

renderListings();

// function for search field
// make latest listings first? - add filter function?
