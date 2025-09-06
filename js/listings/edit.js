import NoroffAPI from './../api.js';
import {
  createAddImageBtn,
  createDeleteButton,
  createInputDiv,
  createOverlayForm,
  createSubmitButton,
  displayOverlay,
} from './../utils/overlay.js';
import { deleteListing } from './delete.js';
import { toLocalDatetimeValue } from './../utils/math.js';

const api = new NoroffAPI();

export async function showEditListingOverlay(id) {
  const listing = await api.listings.viewSingle(id);

  const title = createInputDiv('title', {
    labelText: 'Product title',
    value: listing.title,
    placeholder: 'Enter product title',
  });

  const titleInput = title.querySelector('input');
  titleInput.required = true;

  const description = createInputDiv('description', {
    labelText: 'Product description',
    value: listing.description,
    placeholder: 'Describe your product',
  });

  const mediaContainer = document.createElement('div');
  mediaContainer.classList.add('flex', 'flex-col', 'gap-2');

  const images = listing.media;
  images.forEach((image) => {
    const imageUrl = createInputDiv('imageUrl', {
      labelText: 'Image URL',
      type: 'url',
      value: image.url,
      placeholder: 'Enter valid image URL',
    });

    const imageAlt = createInputDiv('imageAlt', {
      labelText: 'Image ALT',
      value: image.alt,
      placeholder: 'Describe the image',
    });

    mediaContainer.append(imageUrl, imageAlt);
  });

  const addImageBtn = createAddImageBtn();

  addImageBtn.addEventListener('click', () => {
    const newUrl = createInputDiv('imageUrl', {
      labelText: 'Image URL',
      type: 'url',
      placeholder: 'Enter valid image URL',
    });
    const newAlt = createInputDiv('imageAlt', {
      labelText: 'Image ALT',
      placeholder: 'Describe the image',
    });
    mediaContainer.append(newUrl, newAlt);
  });

  const endsAt = createInputDiv('endsAt', {
    labelText: `Expiration date (can't be changed)`,
    type: 'datetime-local',
    value: toLocalDatetimeValue(listing.endsAt),
  });

  const endsAtInput = endsAt.querySelector('input');
  endsAtInput.disabled = true;

  const submitBtn = createSubmitButton('save changes');
  const deleteBtn = createDeleteButton('delete listing');

  deleteBtn.addEventListener('click', () => {
    console.log('delete clicked');
    deleteListing(id);
  });

  const form = createOverlayForm([
    title,
    description,
    mediaContainer,
    addImageBtn,
    endsAt,
    submitBtn,
    deleteBtn,
  ]);

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const title = formData.get('title')?.trim();
    const description = formData.get('description')?.trim() || '';

    const urls = formData.getAll('imageUrl').map((v) => v.trim());
    const alts = formData.getAll('imageAlt').map((v) => v.trim());
    const media = urls.map((url, i) => ({ url, alt: alts[i] || '' }));

    const updatedListing = {
      title,
      description,
      media: media.filter((m) => m.url.length > 0),
    };

    await api.listings.update(updatedListing, id);
    form.closest('.overlay')?.remove();
    document.querySelector('.overlay-bg')?.remove();
  });

  displayOverlay('Edit listing', form);
}
