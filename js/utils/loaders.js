/**
 * Creates a loading spinner styled with the orange tertiary color.
 *
 * @returns {HTMLDivElement} - A div element with the loading spinner.
 */
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

/**
 * Shows a loading spinner in the container provided.
 *
 * @param {HTMLElement} container - The container that should append the loading spinner.
 */
export function showLoadingSpinner(container) {
  container.setAttribute('aria-busy', 'true');
  container.append(createLoadingSpinner());
}

/**
 * Hides the loading spinner from the container provided.
 *
 * @param {HTMLElement} container  - The container that the loading spinner should be removed from.
 */
export function hideLoadingSpinner(container) {
  container.removeAttribute('aria-busy');
  const spinner = container.querySelector('[data-spinner="true"]');
  if (spinner) spinner.remove();
}
