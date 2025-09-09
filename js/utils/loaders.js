export function setLoadingStateForSingleListing() {
  const title = document.getElementById('listing-title');
  const description = document.getElementById('listing-description');
  const imgContainer = document.getElementById('listing-img-container');

  if (title) title.textContent = 'Loading...';
  if (description) description.textContent = 'Loading...';

  imgContainer.querySelector('[data-skeleton="img"]')?.remove();

  const imgPlaceholder = document.createElement('div');
  imgPlaceholder.dataset.skeleton = 'img';
  imgPlaceholder.setAttribute('aria-hidden', 'true');
  imgPlaceholder.className = 'w-full rounded-xl h-96 bg-tertiary animate-pulse';
  imgContainer.append(imgPlaceholder);
}
