import NoroffAPI from './../api.js';
import {
  createAddImageBtn,
  createInputDiv,
  createOverlayForm,
  createSubmitButton,
  displayOverlay,
  removeStackedOverlays,
} from './../utils/overlay.js';
import { createButton } from './../utils/overlay.js';
import { setRestrictionsOnDateSelection } from './../utils/math.js';
import { addValidationListener } from './../utils/validation.js';

const api = new NoroffAPI();

function buildTitleSection() {
  const title = createInputDiv('title', {
    labelText: 'Product title',
    placeholder: 'Enter product title',
  });

  const input = title.querySelector('input');
  input.required = true;
  addValidationListener(input);

  return title;
}

function buildDescriptionSection() {
  const description = createInputDiv('description', {
    labelText: 'Product description',
    placeholder: 'Describe your product',
    textarea: true,
  });

  return description;
}

function buildMediaSection() {
  const imageUrl = createInputDiv('imageUrl', {
    labelText: 'Image URL',
    type: 'url',
    placeholder: 'Enter valid image URL',
  });
  const imageAlt = createInputDiv('imageAlt', {
    labelText: 'Image Alt text',
    placeholder: 'Describe the image',
  });

  const container = document.createElement('div');
  container.classList.add('flex', 'flex-col', 'gap-2');
  container.append(imageUrl, imageAlt);

  const addBtn = createAddImageBtn();
  addBtn.addEventListener('click', () => {
    const newUrl = createInputDiv('imageUrl', {
      labelText: 'Image URL',
      type: 'url',
      placeholder: 'Enter valid image URL',
    });
    const newAlt = createInputDiv('imageAlt', {
      labelText: 'Image Alt text',
      placeholder: 'Describe the image',
    });
    container.append(newUrl, newAlt);
  });

  return { container, addBtn };
}

function buildEndsAtSection() {
  const endsAt = createInputDiv('endsAt', {
    labelText: 'Expiration date',
    type: 'datetime-local',
  });

  const input = endsAt.querySelector('input');
  input.required = true;
  setRestrictionsOnDateSelection(input);
  addValidationListener(input);

  return endsAt;
}

function getDataFromForm(form) {
  const formData = new FormData(form);

  const title = formData.get('title')?.trim();
  const description = formData.get('description')?.trim() || '';

  const endsAtLocal = formData.get('endsAt');
  const endsAt = endsAtLocal ? new Date(endsAtLocal).toISOString() : null;

  const urls = formData.getAll('imageUrl').map((v) => v.trim());
  const alts = formData.getAll('imageAlt').map((v) => v.trim());
  const media = urls
    .map((url, i) => ({ url, alt: alts[i] || '' }))
    .filter((m) => m.url.length > 0);

  return { title, description, media, endsAt };
}

async function handleCreateSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const submitBtn = form.querySelector('button[type="submit"]');

  try {
    submitBtn.disabled = true;
    submitBtn.textContent = 'adding...';

    const { title, description, media, endsAt } = getDataFromForm(form);

    if (!title || !endsAt) {
      form.reportValidity?.();
      return;
    }

    await api.listings.create({ title, description, media, endsAt });

    removeStackedOverlays();
    const button = createButton(true);
    displayOverlay('Your listing has been posted successfully!', button, true);
  } catch (error) {
    removeStackedOverlays();
    const button = createButton();
    displayOverlay(`Something went wrong: ${error.message} `, button);
    console.error(error.message);
  } finally {
    submitBtn.disabled = false;
  }
}

export function showCreateListingOverlay() {
  const title = buildTitleSection();
  const description = buildDescriptionSection();
  const { container: mediaContainer, addBtn: addImageBtn } =
    buildMediaSection();
  const endsAt = buildEndsAtSection();
  const submitBtn = createSubmitButton('add listing');

  const form = createOverlayForm([
    title,
    description,
    mediaContainer,
    addImageBtn,
    endsAt,
    submitBtn,
  ]);

  form.addEventListener('submit', handleCreateSubmit);

  displayOverlay('Add new listing', form);
}
