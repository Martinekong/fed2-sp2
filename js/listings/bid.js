import NoroffAPI from './../api.js';
import { showErrorMessage } from './../utils/validation.js';
import { displayOverlay, createButton } from './../utils/overlay.js';

const api = new NoroffAPI();

const bidForm = document.getElementById('bid-form');
const bidInput = document.getElementById('place-bid');

const params = new URLSearchParams(window.location.search);
const listingId = params.get('id');

async function submitBid(event) {
  event.preventDefault();
  const submitBtn = bidForm.querySelector('button[type="submit"]');

  try {
    submitBtn.disabled = true;

    const amount = parseInt(bidInput.value, 10);

    if (!amount || amount <= 0) {
      const errorContainer = document.getElementById('bid-error-container');
      showErrorMessage(
        errorContainer,
        'You need to fill in a valid amount.',
        true,
      );
      return;
    }

    await api.listings.bid(amount, listingId);
    const button = createButton(true);
    displayOverlay('Your bid has been successfully placed!', button, true);
  } catch (error) {
    const errorContainer = document.getElementById('bid-error-container');
    showErrorMessage(errorContainer, `${error.message}.`, true);
  } finally {
    submitBtn.disabled = false;
  }
}

bidForm.addEventListener('submit', submitBid);
