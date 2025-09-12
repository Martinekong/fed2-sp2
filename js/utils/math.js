/**
 * Creates a countdown timer inside a element.
 * Updates every second until the end date is reached.
 *
 * @param {string|Date} endDate - The end date/time as an ISO string or Date object.
 * @param {HTMLElement} element - The element where the countdown text is displayed.
 */
export function createCountdown(endDate, element) {
  function updateCountdown() {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;

    if (diff <= 0) {
      element.textContent = 'Expired';
      clearInterval(interval);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    element.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }

  updateCountdown();
  const interval = setInterval(updateCountdown, 1000);
}

/**
 * Finds the highest bid from a listing.
 *
 * @param {{ bids: { amount: number }[] }} listing - A listing object containing an array of bids.
 * @returns {number} The amount of the highest bid, or 0 if no bids exist.
 */
export function findHighestBid(listing) {
  const highestBid = listing.bids.reduce(
    (max, bid) => {
      return bid.amount > max.amount ? bid : max;
    },
    { amount: 0 },
  );

  return highestBid.amount;
}

/**
 * Converts an ISO date string into a value for a `datetime-local` input field.
 *
 * Adjusts to the user’s local timezone.
 *
 * @param {string} isoString - An ISO formatted date string.
 * @returns {string} The formatted local datetime string (YYYY-MM-DDTHH:MM).
 */
export function toLocalDatetimeValue(isoString) {
  const d = new Date(isoString);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

/**
 * Restricts a datetime input field so that:
 * - The minimum date is the current date.
 * - The maximum date is one year from the current date.
 *
 * @param {HTMLInputElement} input - The input element of type `datetime-local`.
 */
export function setRestrictionsOnDateSelection(input) {
  const now = new Date();
  now.setSeconds(0, 0);
  const oneYearLater = new Date(now);
  oneYearLater.setFullYear(now.getFullYear() + 1);
  const formatDateTime = (date) => date.toISOString().slice(0, 16);
  input.min = formatDateTime(now);
  input.max = formatDateTime(oneYearLater);
}
