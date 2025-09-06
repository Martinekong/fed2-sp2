import {
  createAddImageBtn,
  createInputDiv,
  createOverlayForm,
  createSubmitButton,
  displayOverlay,
} from './../utils/overlay.js';
import NoroffAPI from './../api.js';
import { setRestrictionsOnDateSelection } from '../utils/math.js';

const api = new NoroffAPI();
const createListingBtn = document.getElementById('create-listing-btn');

async function showCreateListingOverlay() {
  const title = createInputDiv('title', {
    labelText: 'Product title',
    placeholder: 'Enter product title',
  });

  const titleInput = title.querySelector('input');
  titleInput.required = true;

  const description = createInputDiv('description', {
    labelText: 'Product description',
    placeholder: 'Describe your product',
    textarea: true,
  });

  const mediaUrl = createInputDiv('mediaUrl', {
    labelText: 'Image URL',
    type: 'url',
    placeholder: 'Enter valid image URL',
  });

  const mediaAlt = createInputDiv('mediaAlt', {
    labelText: 'Image Alt text',
    placeholder: 'Describe the image',
  });

  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('flex', 'flex-col', 'gap-2');
  mediaContainer.append(mediaUrl, mediaAlt);

  const addImageBtn = createAddImageBtn();

  addImageBtn.addEventListener('click', () => {
    const newUrl = createInputDiv('mediaUrl', {
      labelText: 'Image URL',
      type: 'url',
      placeholder: 'Enter valid image URL',
    });
    const newAlt = createInputDiv('mediaAlt', {
      labelText: 'Image Alt text',
      placeholder: 'Describe the image',
    });
    mediaContainer.append(newUrl, newAlt);
  });

  const endsAt = createInputDiv('endsAt', {
    labelText: 'Expiration date',
    type: 'datetime-local',
  });

  const endsAtInput = endsAt.querySelector('input');
  endsAtInput.required = true;
  setRestrictionsOnDateSelection(endsAtInput);

  [titleInput, endsAtInput].forEach((el) => {
    el.addEventListener('invalid', () => el.classList.add('border-error'));
    el.addEventListener('input', () => el.classList.remove('border-error'));
  });

  const submitBtn = createSubmitButton('add listing');

  const form = createOverlayForm([
    title,
    description,
    mediaContainer,
    addImageBtn,
    endsAt,
    submitBtn,
  ]);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const title = formData.get('title')?.trim();
    const description = formData.get('description')?.trim() || '';
    const endsAtLocal = formData.get('endsAt');
    const endsAt = endsAtLocal ? new Date(endsAtLocal).toISOString() : null;

    const urls = formData.getAll('mediaUrl').map((v) => v.trim());
    const alts = formData.getAll('mediaAlt').map((v) => v.trim());
    const media = urls.map((url, i) => ({ url, alt: alts[i] || '' }));

    const newListing = {
      title,
      description,
      media: media.filter((m) => m.url.length > 0),
      endsAt,
    };

    await api.listings.create(newListing);
    form.closest('.overlay')?.remove();
    document.querySelector('.overlay-bg')?.remove();
  });

  displayOverlay('Add new listing', form);
}

createListingBtn.addEventListener('click', () => {
  showCreateListingOverlay();
});

// Todo:
// This needs refactoring
