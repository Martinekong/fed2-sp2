import { createCountdown, findHighestBid } from './math.js';
import { getBasePath } from './constants.js';

/**
 * Creates a clickable card with a link.
 *
 * @param {string} href - The URL the card should link to.
 * @returns {HTMLAnchorElement} - The card element.
 */
export function createCard(href) {
  const card = document.createElement('a');
  card.href = href;
  card.classList.add(
    'relative',
    'rounded-2xl',
    'bg-secondary',
    'hover:bg-secondary-hover',
    'shadow-2xl',
    'group',
  );
  return card;
}

/**
 * Creates an image element for a card.
 *
 * Adds a placeholder image if the listing has no media or if there is an error with the image url.
 *
 * @param {Object} listing - The listing object containing media and title.
 * @returns {HTMLImageElement} - The image element.
 */
export function createCardImage(listing) {
  if (listing.media && listing.media.length > 0) {
    const img = document.createElement('img');
    img.classList.add('h-52', 'w-full', 'object-cover', 'rounded-t-2xl');

    img.src = listing.media[0].url;
    img.alt = listing.media[0].alt || listing.title;

    img.onerror = () => {
      setPlaceholderImg(img);
    };
    return img;
  } else {
    const img = document.createElement('img');
    img.classList.add('h-52', 'w-full', 'object-cover', 'rounded-t-2xl');
    setPlaceholderImg(img);
    return img;
  }
}

/**
 * Sets a placeholder image to a image element.
 *
 * @param {HTMLImageElement} img - The image element to update.
 */
function setPlaceholderImg(img) {
  const path = getBasePath();
  img.src = `${path}/assets/images/placeholder.jpg`;
  img.alt = 'Placeholder image';
}

/**
 * Creates a div container with the title of a listing.
 *
 * Can append card info like title, bids and end date.
 *
 * @param {Object} listing - The listing object.
 * @returns {HTMLDivElement} - The info container element.
 */
export function createCardInfoDiv(listing) {
  const infoDiv = document.createElement('div');
  infoDiv.classList.add('px-4', 'pt-4', 'pb-10', 'flex', 'flex-col', 'gap-4');
  const title = document.createElement('h2');
  title.classList.add('font-heading', 'text-2xl');
  title.textContent = listing.title;
  infoDiv.append(title);
  return infoDiv;
}

/**
 * Creates a div with information of a listing (e.g. latest bid, end date, user bid).
 *
 * @param {Object} listing - The listing object.
 * @param {"latestBid"|"endDate"|"yourBid"} name - The type of information to display.
 * @returns {HTMLDivElement} - A container with label and value.
 */
export function createCardInfo(listing, name) {
  const container = document.createElement('div');
  container.classList.add('flex', 'gap-6');
  const text = document.createElement('p');
  const content = document.createElement('p');

  if (name === 'latestBid') {
    text.textContent = 'Latest bid:';
    const latestBid = findHighestBid(listing);
    content.textContent = latestBid;
    content.classList.add('font-bold');
  } else if (name === 'endDate') {
    text.textContent = 'Expires in:';
    text.textContent = 'Expires in:';
    if (new Date(listing.endsAt) <= new Date()) {
      content.textContent = 'Expired';
    } else {
      content.textContent = new Date(listing.endsAt).toLocaleDateString();
      createCountdown(listing.endsAt, content);
    }
  } else if (name === 'yourBid') {
    text.textContent = 'Your bid:';
    content.textContent = listing;
    content.classList.add('font-bold');
  }

  container.append(text, content);
  return container;
}

/**
 * Creates a button for a card (e.g. "Bid on it").
 * Includes an arrow icon with hover animation.
 *
 * @param {string} content - The button text.
 * @returns {HTMLButtonElement} - The button element.
 */
export function createCardBtn(content) {
  const bidBtn = document.createElement('button');
  bidBtn.classList.add('card-btn');
  const text = content;
  const icon = document.createElement('span');
  icon.classList.add('material-symbols-outlined');
  icon.textContent = 'arrow_forward';
  icon.classList.add(
    'material-symbols-outlined',
    'transition-transform',
    'duration-300',
    'group-hover:translate-x-3',
  );
  bidBtn.append(text, icon);
  return bidBtn;
}
