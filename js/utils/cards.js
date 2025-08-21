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

export function createCardBtn(href, content) {
  const bidBtn = document.createElement('a');
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
  bidBtn.href = href;
  bidBtn.append(text, icon);
  return bidBtn;
}
