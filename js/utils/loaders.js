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

export function setLoadingBannerAndAvatar(container) {
  const banner = document.createElement('div');
  banner.dataset.skeleton = 'img';
  banner.setAttribute('aria-hidden', 'true');
  banner.classList.add(
    'bg-tertiary',
    'animate-pulse',
    'w-full',
    'h-40',
    'rounded-2xl',
  );

  const avatar = document.createElement('div');
  avatar.dataset.skeleton = 'img';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.classList.add(
    'absolute',
    'bottom-0',
    'bg-tertiary',
    '-translate-x-1/2',
    'translate-y-1/4',
    'w-36',
    'h-36',
    'left-1/2',
    'rounded-2xl',
  );
  container.append(banner, avatar);
}
