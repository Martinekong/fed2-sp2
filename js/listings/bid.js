import NoroffAPI from './../api.js';
import { showErrorMessage } from './../utils/validation.js';

const api = new NoroffAPI();

const bidForm = document.getElementById('bid-form');
const bidInput = document.getElementById('place-bid');

const params = new URLSearchParams(window.location.search);
const listingId = params.get('id');

bidForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const amount = parseInt(bidInput.value, 10);

  if (!amount || amount <= 0) {
    const errorContainer = document.getElementById('error-container');
    showErrorMessage(errorContainer, 'You need to fill in a valid amount.');
    return;
  }

  await api.listings.bid(amount, listingId);
});
