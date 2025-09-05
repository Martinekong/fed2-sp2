export function displayOverlay(message, content, shouldReload = false) {
  const overlayBg = document.createElement('div');
  overlayBg.classList.add('overlay-bg');

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  overlay.setAttribute('aria-modal', 'true');

  const overlayHeading = document.createElement('h2');
  overlayHeading.classList.add('text-2xl', 'pt-4');
  overlayHeading.textContent = message;

  const closeBtn = document.createElement('span');
  closeBtn.classList.add(
    'material-symbols-outlined',
    'absolute',
    'top-4',
    'right-4',
  );
  closeBtn.textContent = 'close';
  closeBtn.setAttribute('aria-label', 'close overlay');

  function closeOverlay() {
    overlayBg.remove();
    overlay.remove();
    if (shouldReload) window.location.reload();
  }

  closeBtn.addEventListener('click', closeOverlay);
  overlayBg.addEventListener('click', closeOverlay);

  overlay.append(overlayHeading, content, closeBtn);
  document.body.append(overlayBg, overlay);
}

export function createOverlayForm(inputDivs) {
  const form = document.createElement('form');
  form.classList.add('flex', 'flex-col', 'w-full', 'gap-8');

  form.append(...inputDivs);
  return form;
}

export function createInputDiv(
  name,
  { labelText = null, type = 'text', value = '', placeholder = '' } = {},
) {
  const div = document.createElement('div');
  div.classList.add('input-div');

  const label = document.createElement('label');
  label.htmlFor = name;
  label.textContent = labelText ?? name.charAt(0).toUpperCase() + name.slice(1);

  const input = document.createElement('input');
  input.classList.add('input');
  input.id = name;
  input.name = name;
  input.type = type;
  input.value = value ?? '';
  if (placeholder) input.placeholder = placeholder;

  div.append(label, input);
  return div;
}

export function addOkButton() {
  const button = document.createElement('button');
  button.classList.add('primary-btn');
  button.textContent = 'OK';
  button.setAttribute('aria-label', 'close overlay');

  button.addEventListener('click', () => {
    window.location.reload();
  });

  return button;
}
