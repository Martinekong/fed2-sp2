/**
 * Shows a dark background and an overlay with a heading and content.
 *
 * Clicking the background or the close icon will close the overlay.
 *
 * Disables body scrolling under the overlay.
 *
 * @param {string} message - Heading text for the overlay.
 * @param {HTMLElement} content - The content to render inside the overlay (e.g. a form or buttons).
 * @param {boolean} [shouldReload=false] - If true, reloads the page after the overlay closes.
 * @returns {void}
 */
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

/**
 * Creates a form element with a flex columns layout and appends the provided input divs.
 *
 * @param {HTMLElement[]} inputDivs - A list of input div elements.
 * @returns {HTMLFormElement} The created form element.
 */
export function createOverlayForm(inputDivs) {
  const form = document.createElement('form');
  form.classList.add('flex', 'flex-col', 'w-full', 'gap-8');

  form.append(...inputDivs);
  return form;
}

/**
 * @typedef {Object} InputOptions
 * @property {string|null} [labelText=null] - Custom label text. Defaults to a capitalized version of `name`.
 * @property {'text'|'email'|'url'|'number'|'datetime-local'|'password'} [type='text'] - Default to `text`. Ignored if `textarea` is true.
 * @property {string} [value=''] - Initial value for the field.
 * @property {string} [placeholder=''] - Placeholder text.
 * @property {boolean} [textarea=false] - If true, renders a `<textarea>` instead of an `<input>`.
 */

/**
 * Creates a labeled input div containing a label and an input/textarea.
 *
 * @param {string} name - Field name; used for id/name and default label.
 * @param {InputOptions} [options={}] - Options for the input field.
 * @returns {HTMLDivElement} A div containing the label and the field.
 */
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

/**
 * Creates a “Add another image” button with a right-arrow icon.
 *
 * @returns {HTMLButtonElement} The button element.
 */
export function createAddImageBtn() {
  const addImageBtn = document.createElement('button');
  addImageBtn.type = 'button';
  addImageBtn.textContent = 'Add another image';
  addImageBtn.classList.add('secondary-btn', 'group');

  const addImageIcon = document.createElement('span');
  addImageIcon.classList.add(
    'material-symbols-outlined',
    'transition-transform',
    'duration-300',
    'group-hover:translate-x-3',
  );
  addImageIcon.textContent = 'arrow_forward';

  addImageBtn.append(addImageIcon);

  return addImageBtn;
}

/**
 * Creates a primary submit button with provided text.
 *
 * @param {string} content - Button text.
 * @returns {HTMLButtonElement} The submit button element.
 */
export function createSubmitButton(content) {
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.textContent = content;
  submitBtn.classList.add('primary-btn', 'w-full');
  return submitBtn;
}

/**
 * Creates a “OK” button that closes the nearest overlay and can reload the page.
 *
 * @param {boolean} [shouldReload=false] - If true, reloads after click.
 * @returns {HTMLButtonElement} The button element.
 */
export function createButton(shouldReload = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('primary-btn', 'w-[80vw]', 'sm:w-full');
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

/**
 * Creates an error-styled button (not submit button).
 *
 * @param {string} content - Button label.
 * @returns {HTMLButtonElement} The button element.
 */
export function createDeleteButton(content) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = content;
  button.classList.add('tertiary-btn', 'w-full');
  return button;
}

/**
 * Closes and removes all current overlays and their backgrounds.
 * Re-enables body scrolling under the overlays.
 */
export function removeStackedOverlays() {
  document
    .querySelectorAll('.overlay, .overlay-bg')
    .forEach((el) => el.remove());
  document.body.classList.remove('overflow-hidden');
}
