import { createCountdown } from './time.js';

export function createCard(href) {
  const card = document.createElement('a');
  card.href = href;
  card.classList.add(
    'relative',
    'rounded-2xl',
    'bg-secondary',
    'hover:bg-secondary-hover',
    'shadow-lg',
    'group',
  );
  return card;
}

export function createCardImage(listing) {
  if (listing.media && listing.media.length > 0) {
    const img = document.createElement('img');
    img.classList.add('h-52', 'w-full', 'object-cover', 'rounded-t-2xl');
    img.src = listing.media[0].url;
    img.alt = listing.media[0].alt || listing.title;

    img.onerror = () => {
      img.src = './assets/images/placeholder.jpg';
      img.alt = 'Placeholder image';
    };
    return img;
  } else {
    const img = document.createElement('img');
    img.classList.add('h-52', 'w-full', 'object-cover', 'rounded-t-2xl');
    img.src = './assets/images/placeholder.jpg';
    img.alt = 'Placeholder image';
    return img;
  }
}

export function createCardInfoDiv(listing) {
  const infoDiv = document.createElement('div');
  infoDiv.classList.add('px-4', 'pt-4', 'pb-10', 'flex', 'flex-col', 'gap-4');
  const title = document.createElement('h2');
  title.classList.add('font-heading', 'text-2xl');
  title.textContent = listing.title;
  infoDiv.append(title);
  return infoDiv;
}

export function createCardInfo(listing, name) {
  const container = document.createElement('div');
  container.classList.add('flex', 'gap-6');
  const text = document.createElement('p');
  const content = document.createElement('p');

  if (name === 'latestBid') {
    text.textContent = 'Latest bid:';
    content.textContent = listing._count?.bids ?? 0;
    content.classList.add('font-bold');
  } else if (name === 'endDate') {
    text.textContent = 'Expires in:';
    content.textContent = new Date(listing.endsAt).toLocaleDateString();
    createCountdown(listing.endsAt, content);
  }

  container.append(text, content);
  return container;
}

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
