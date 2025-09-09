function createLoadingSpinner() {
  const spinnerDiv = document.createElement('div');
  spinnerDiv.dataset.spinner = 'true';
  spinnerDiv.className = 'flex items-center justify-center py-8';

  const spinner = document.createElement('div');
  spinner.className =
    'w-10 h-10 border-4 rounded-full border-tertiary border-t-transparent animate-spin';

  spinnerDiv.append(spinner);
  return spinnerDiv;
}

export function showLoadingSpinner(container) {
  container.setAttribute('aria-busy', 'true');
  container.append(createLoadingSpinner());
}

export function hideLoadingSpinner(container) {
  container.removeAttribute('aria-busy');
  const spinner = container.querySelector('[data-spinner="true"]');
  if (spinner) spinner.remove();
}
