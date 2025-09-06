export function showErrorMessage(container, message) {
  container.textContent = message;
  container.classList.add('text-error', 'pt-2');
}
