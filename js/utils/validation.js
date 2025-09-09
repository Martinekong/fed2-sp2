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

export function showSuccessMessage(container, message) {
  container.classList.remove('hidden');
  container.textContent = message;
  container.classList.add('font-bold', 'text-success');
}

// smoother transition on these messages? Maybe absolute/relative? Also add border and icon?

export function showUserMessage(container, message) {
  const p = document.createElement('p');
  p.textContent = message;
  container.append(message);
}
