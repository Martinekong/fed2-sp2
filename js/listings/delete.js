import NoroffAPI from './../api.js';
import {
  createDeleteButton,
  createButton,
  displayOverlay,
  removeStackedOverlays,
} from './../utils/overlay.js';

const api = new NoroffAPI();

export function deleteListing(id) {
  removeStackedOverlays();

  const options = document.createElement('div');
  options.classList.add('flex', 'flex-col', 'gap-4');

  const noBtn = createButton();
  noBtn.textContent = 'no';

  const yesBtn = createDeleteButton('yes, delete');

  options.append(noBtn, yesBtn);

  displayOverlay('Are you sure you want to delete this listing?', options);

  noBtn.addEventListener('click', () => {
    removeStackedOverlays();
  });

  yesBtn.addEventListener('click', async () => {
    yesBtn.disabled = true;
    noBtn.disabled = true;
    yesBtn.textContent = 'deleting…';

    try {
      await api.listings.delete(id);
      removeStackedOverlays();
      const button = createButton(true);
      displayOverlay(
        'Your listing has been successfully deleted!',
        button,
        true,
      );
    } catch (error) {
      removeStackedOverlays();
      const button = createButton(false);
      displayOverlay(`Something went wrong: ${error.message}`, button);
      console.error(error);
    }
  });
}
