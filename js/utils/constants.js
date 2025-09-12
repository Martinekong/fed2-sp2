export const BASE_URL = 'https://v2.api.noroff.dev';
export const API_KEY = '65fe4350-b47e-418b-be09-9ceebd1021f0';

/**
 * Finds the base path depending on where its running.
 *
 * - If running on GitHub Pages it appends the repository name to the origin.
 * - Otherwise, it just returns the origin (e.g. http://localhost:5500).
 *
 * @returns {string} The base URL path to use for building navigation links.
 */
export function getBasePath() {
  const { origin, hostname } = window.location;
  if (hostname.includes('github.io')) {
    return `${origin}/fed2-sp2`;
  }
  return origin;
}
