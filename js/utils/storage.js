/**
 * Saves the user token to localStorage.
 * @param {string} token - The authentication token to save.
 */
export function saveToken(token) {
  localStorage.setItem('token', token);
}

/**
 * Gets the user token from localStorage.
 * @returns {string|null} The saved authentication token, or null if none exists.
 */
export function getToken() {
  return localStorage.getItem('token');
}

/**
 * Saves the user's username to localStorage.
 * @param {string} user - The username to save.
 */
export function saveUser(user) {
  localStorage.setItem('user', user);
}

/**
 * Gets the user's username from localStorage.
 * @returns {string|null} The saved username, or null if none exists.
 */
export function getUser() {
  return localStorage.getItem('user');
}
