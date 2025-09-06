export function showErrorMessage(container, message) {
  container.classList.remove('hidden');
  container.textContent = message;
  container.classList.add('text-error', 'pt-2');

  setTimeout(() => {
    container.classList.add('hidden');
    container.textContent = '';
  }, 4000);
}

// In html:
// <p id="error-container" class="hidden"></p>

// In api:
// const errorContainer = document.getElementById('error-container');
// showErrorMessage(errorContainer, `${error.message}.`);

export function showSuccessMessage(container, message) {
  container.classList.remove('hidden');
  container.textContent = message;
  container.classList.add('font-bold', 'text-success');
}
