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
    'cursor-pointer',
  );
  closeBtn.textContent = 'close';
  closeBtn.setAttribute('aria-label', 'close overlay');

  function closeOverlay() {
    overlayBg.remove();
    overlay.remove();
    document.body.classList.remove('overflow-hidden');
    if (shouldReload) window.location.reload();
  }

  closeBtn.addEventListener('click', closeOverlay);
  overlayBg.addEventListener('click', closeOverlay);

  overlay.append(overlayHeading, content, closeBtn);
  document.body.append(overlayBg, overlay);

  document.body.classList.add('overflow-hidden');
}

export function createOverlayForm(inputDivs) {
  const form = document.createElement('form');
  form.classList.add('flex', 'flex-col', 'w-full', 'gap-8');

  form.append(...inputDivs);
  return form;
}

export function createInputDiv(
  name,
  {
    labelText = null,
    type = 'text',
    value = '',
    placeholder = '',
    textarea = false,
  } = {},
) {
  const div = document.createElement('div');
  div.classList.add('input-div');

  const label = document.createElement('label');
  label.htmlFor = name;
  label.textContent = labelText ?? name.charAt(0).toUpperCase() + name.slice(1);

  let field;
  if (textarea) {
    field = document.createElement('textarea');
    field.rows = 3;
  } else {
    field = document.createElement('input');
    field.type = type;
  }

  field.classList.add('input', 'resize-none');
  field.id = name;
  field.name = name;
  field.value = value ?? '';
  if (placeholder) field.placeholder = placeholder;

  div.append(label, field);
  return div;
}

export function createAddImageBtn() {
  const addImageBtn = document.createElement('button');
  addImageBtn.type = 'button';
  addImageBtn.textContent = 'Add another image';
  addImageBtn.classList.add('secondary-btn');

  const addImageIcon = document.createElement('span');
  addImageIcon.classList.add('material-symbols-outlined');
  addImageIcon.textContent = 'arrow_forward';

  addImageBtn.append(addImageIcon);

  return addImageBtn;
}

export function createSubmitButton(content) {
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = content;
  submitBtn.classList.add('primary-btn', 'w-full');
  return submitBtn;
}

export function createButton(shouldReload = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('primary-btn', 'w-full');
  button.textContent = 'OK';
  button.setAttribute('aria-label', 'close overlay');

  button.addEventListener('click', () => {
    const overlay = button.closest('.overlay');
    const bg = overlay?.previousElementSibling;
    overlay?.remove();
    if (bg && bg.classList.contains('overlay-bg')) bg.remove();

    document.body.classList.remove('overflow-hidden');

    if (shouldReload) window.location.reload();
  });

  return button;
}

export function createDeleteButton(content) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = content;
  button.classList.add('tertiary-btn', 'w-full');
  return button;
}

export function removeStackedOverlays() {
  document
    .querySelectorAll('.overlay, .overlay-bg')
    .forEach((el) => el.remove());
  document.body.classList.remove('overflow-hidden');
}
