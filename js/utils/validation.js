/**
 * Displays an error message to the user by showing a hidden container
 * and inserting the provided text inside it.
 *
 * @param {HTMLElement} container - The container where the message will appear.
 * @param {string} message - The error message that will be shown to the user.
 * @param {boolean} [timeout=false] - Whether the message should disappear automatically
 * after 4 seconds (true) or remain visible (false).
 */
export function showErrorMessage(container, message, timeout = false) {
  container.classList.remove('hidden');
  container.textContent = message;
  container.classList.add('text-error', 'pt-2');

  if (timeout) {
    setTimeout(() => {
      container.classList.add('hidden');
      container.textContent = '';
    }, 4000);
  }
}

/**
 * Displays a success message to the user by showing a hidden container
 * and inserting the provided text inside it.
 *
 * @param {HTMLElement} container - The container where the message will appear.
 * @param {string} message - The success message to display.
 */
export function showSuccessMessage(container, message) {
  container.classList.remove('hidden');
  container.textContent = message;
  container.classList.add('font-bold', 'text-success');
}

/**
 * Displays a neutral message to the user by appending a <p> element
 * with the provided text inside the given container.
 *
 * @param {HTMLElement} container - The container where the message will appear.
 * @param {string} message - The message that will be shown to the user.
 */
export function showUserMessage(container, message) {
  const p = document.createElement('p');
  p.textContent = message;
  container.append(p);
}

/**
 * Attaches validation listeners to an input field.
 * Adds a red error border when the field is invalid,
 * and removes it when the user corrects the input.
 *
 * @param {HTMLInputElement} input - The input element to validate.
 */
export function addValidationListener(input) {
  input.addEventListener('invalid', () => input.classList.add('border-error'));
  input.addEventListener('input', () => input.classList.remove('border-error'));
}
