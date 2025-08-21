import NoroffAPI from './../api.js';
import { createCardBtn, createCardImage } from './../utils/cards.js';
import { createCountdown } from './../utils/time.js';

const api = new NoroffAPI();
const listingGrid = document.getElementById('listing-grid');

async function renderListings() {
  const listings = await api.listings.viewAll();

  listings.forEach((listing) => {
    createListingCard(listing);
  });
}

function createListingCard(listing) {
  const card = document.createElement('a');
  card.href = `./listing/index.html?id=${listing.id}`;
  card.classList.add(
    'border',
    'relative',
    'rounded-2xl',
    'bg-secondary',
    'hover:bg-secondary-hover',
    'shadow-lg',
    'group',
  );

  card.appendChild(createCardImage(listing));

  const content = document.createElement('div');
  content.classList.add('px-4', 'pt-4', 'pb-10', 'flex', 'flex-col', 'gap-4');

  const title = document.createElement('h2');
  title.classList.add('font-heading', 'text-2xl');
  title.textContent = listing.title;

  const latestDiv = document.createElement('div');
  latestDiv.classList.add('flex', 'gap-6');
  const latestText = document.createElement('p');
  const latestBid = document.createElement('p');
  latestText.textContent = 'Latest bid:';
  latestBid.textContent = listing._count?.bids ?? 0;
  latestBid.classList.add('font-bold');
  latestDiv.append(latestText, latestBid);

  const expiresDiv = document.createElement('div');
  expiresDiv.classList.add('flex', 'gap-6');
  const expiresText = document.createElement('p');
  const expiresBid = document.createElement('p');
  expiresText.textContent = 'Expires in:';
  expiresBid.textContent = new Date(listing.endsAt).toLocaleDateString();
  expiresDiv.append(expiresText, expiresBid);

  createCountdown(listing.endsAt, expiresBid);

  content.append(title, latestDiv, expiresDiv);

  const button = createCardBtn(
    `./listing/index.html?id=${listing.id}`,
    'bid on it',
  );

  card.append(content, button);
  listingGrid.append(card);
}

renderListings();
