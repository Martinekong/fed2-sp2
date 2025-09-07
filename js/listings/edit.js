import NoroffAPI from './../api.js';
import {
  createAddImageBtn,
  createDeleteButton,
  createInputDiv,
  createOverlayForm,
  createSubmitButton,
  createButton,
  displayOverlay,
  removeStackedOverlays,
} from './../utils/overlay.js';
import { deleteListing } from './delete.js';
import { toLocalDatetimeValue } from './../utils/math.js';

const api = new NoroffAPI();

function buildTitleSection(listing) {
  const title = createInputDiv('title', {
    labelText: 'Product title',
    value: listing.title,
    placeholder: 'Enter product title',
  });

  const input = title.querySelector('input');
  input.required = true;

  input.addEventListener('invalid', () => input.classList.add('border-error'));
  input.addEventListener('input', () => input.classList.remove('border-error'));

  return title;
}

function buildDescriptionSection(listing) {
  const description = createInputDiv('description', {
    labelText: 'Product description',
    value: listing.description,
    placeholder: 'Describe your product',
  });

  return description;
}

function buildMediaSection(listing) {
  const container = document.createElement('div');
  container.classList.add('flex', 'flex-col', 'gap-2');

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

    container.append(imageUrl, imageAlt);
  });

  const addBtn = createAddImageBtn();

  addBtn.addEventListener('click', () => {
    const newUrl = createInputDiv('imageUrl', {
      labelText: 'Image URL',
      type: 'url',
      placeholder: 'Enter valid image URL',
    });
    const newAlt = createInputDiv('imageAlt', {
      labelText: 'Image ALT',
      placeholder: 'Describe the image',
    });
    container.append(newUrl, newAlt);
  });

  return { container, addBtn };
}

function buildEndsAtSection(listing) {
  const endsAt = createInputDiv('endsAt', {
    labelText: `Expiration date (can't be changed)`,
    type: 'datetime-local',
    value: toLocalDatetimeValue(listing.endsAt),
  });

  const endsAtInput = endsAt.querySelector('input');
  endsAtInput.disabled = true;

  return endsAt;
}

function getUpdatedListingFrom(form) {
  const formData = new FormData(form);

  const title = formData.get('title')?.trim();
  const description = formData.get('description')?.trim() || '';
  const urls = formData.getAll('imageUrl').map((v) => v.trim());
  const alts = formData.getAll('imageAlt').map((v) => v.trim());
  const media = urls
    .map((url, i) => ({ url, alt: alts[i] || '' }))
    .filter((m) => m.url.length > 0);

  return { title, description, media };
}

export async function showEditListingOverlay(id) {
  try {
    const listing = await api.listings.viewSingle(id);
    const title = buildTitleSection(listing);
    const description = buildDescriptionSection(listing);
    const { container: mediaContainer, addBtn: addImageBtn } =
      buildMediaSection(listing);
    const endsAt = buildEndsAtSection(listing);

    const submitBtn = createSubmitButton('save changes');
    const deleteBtn = createDeleteButton('delete listing');
    deleteBtn.addEventListener('click', () => deleteListing(id));

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
      const submitBtn = form.querySelector('button[type="submit"]');
      const deleteBtn = form.querySelector('button.tertiary-btn');

      try {
        submitBtn.disabled = true;
        deleteBtn.disabled = true;
        submitBtn.textContent = 'saving...';
        const { title, description, media } = getUpdatedListingFrom(form);

        await api.listings.update({ title, description, media }, id);

        removeStackedOverlays();
        const button = createButton(true);
        displayOverlay(
          'Your listing has been successfully updated!',
          button,
          true,
        );
      } catch (error) {
        removeStackedOverlays();
        const button = createButton();
        displayOverlay(`Something went wrong: ${error.message} `, button);
        console.error(error);
      } finally {
        submitBtn.disabled = false;
        deleteBtn.disabled = false;
      }
    });

    displayOverlay('Edit listing', form);
  } catch (error) {
    const button = createButton(false);
    displayOverlay(`Couldn't load listing: ${error.message}`, button);
    console.error(error);
  }
}
