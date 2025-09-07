export const BASE_URL = 'https://v2.api.noroff.dev';
export const API_KEY = '65fe4350-b47e-418b-be09-9ceebd1021f0';

export function getBasePath() {
  const { origin, hostname } = window.location;
  if (hostname.includes('github.io')) {
    return `${origin}/fed2-sp2`;
  }
  return origin;
}
