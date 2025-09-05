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

export function findHighestBid(listing) {
  const highestBid = listing.bids.reduce(
    (max, bid) => {
      return bid.amount > max.amount ? bid : max;
    },
    { amount: 0 },
  );

  return highestBid.amount;
}
