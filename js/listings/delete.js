import NoroffAPI from './../api.js';
import {
  createDeleteButton,
  createButton,
  displayOverlay,
  removeStackedOverlays,
} from './../utils/overlay.js';

const api = new NoroffAPI();

export async function deleteListing(id) {
  removeStackedOverlays();

  const options = document.createElement('div');
  options.classList.add('flex', 'flex-col', 'gap-4');

  const noButton = createButton();
  noButton.textContent = 'no';
  noButton.addEventListener('click', () => {
    removeStackedOverlays();
  });

  const yesBtn = createDeleteButton('yes, delete');
  yesBtn.addEventListener('click', () => {
    removeStackedOverlays();
    api.listings.delete(id);
  });

  options.append(noButton, yesBtn);
  displayOverlay('Are you sure you want to delete this listing?', options);
}
