import { BASE_URL, API_KEY } from './utils/constants.js';
import { saveToken, getToken, saveUser, getUser } from './utils/storage.js';
import { displayOverlay, createButton } from './utils/overlay.js';
import { showErrorMessage } from './utils/validation.js';

export default class NoroffAPI {
  constructor(apiBase = `${BASE_URL}`) {
    this.apiBase = apiBase;
  }

  utils = {
    setupHeaders: ({ auth = true, apiKey = true, json = true } = {}) => {
      const headers = {};
      if (json) headers['Content-Type'] = 'application/json';
      if (auth) headers['Authorization'] = `Bearer ${getToken()}`;
      if (apiKey) headers['X-Noroff-API-Key'] = `${API_KEY}`;
      return headers;
    },

    handleResponse: async (response) => {
      if (response.status === 204) return null;

      let result;

      try {
        result = await response.json();
      } catch {
        throw new Error('Invalid JSON response');
      }

      if (!response.ok) {
        const errorMessage = result.errors
          ?.map((err) => err.message)
          .join(', ');
        throw new Error(errorMessage || result.status || 'Unknown error');
      }
      return result.data ?? result;
    },
  };

  auth = {
    login: async ({ email, password }) => {
      try {
        const response = await fetch(`${this.apiBase}/auth/login`, {
          method: 'POST',
          headers: this.utils.setupHeaders({ auth: false, apiKey: false }),
          body: JSON.stringify({ email, password }),
        });

        const data = await this.utils.handleResponse(response);
        console.log(`Logged in user:`, data);
        saveToken(data.accessToken);
        saveUser(data.name);
        return data;
      } catch (error) {
        console.log(error.message);
        // open overlay with error message
      }
    },

    register: async ({ name, email, password }) => {
      try {
        const response = await fetch(`${this.apiBase}/auth/register`, {
          method: 'POST',
          headers: this.utils.setupHeaders({ auth: false, apiKey: false }),
          body: JSON.stringify({ name, email, password }),
        });

        const data = await this.utils.handleResponse(response);
        console.log(`Registered user:`, data);
        return data;
      } catch (error) {
        console.log(error.message);
        // open overlay with error message
      }
    },
  };

  listings = {
    viewAll: async () => {
      try {
        const response = await fetch(
          `${this.apiBase}/auction/listings?_active=true&_bids=true`,
          {
            method: 'GET',
            headers: this.utils.setupHeaders({ auth: false, apiKey: false }),
          },
        );

        const data = await this.utils.handleResponse(response);
        console.log(`All listings:`, data);
        return data;
      } catch (error) {
        console.log(error.message);
      }
    },

    viewSingle: async (id) => {
      try {
        const response = await fetch(
          `${this.apiBase}/auction/listings/${id}?_seller=true&_bids=true`,
          {
            method: 'GET',
            headers: this.utils.setupHeaders({ auth: false, apiKey: false }),
          },
        );

        const data = await this.utils.handleResponse(response);
        console.log(`Single listing:`, data);
        return data;
      } catch (error) {
        console.log(error.message);
      }
    },

    create: async (listing) => {
      try {
        const response = await fetch(`${this.apiBase}/auction/listings`, {
          method: 'POST',
          headers: this.utils.setupHeaders(),
          body: JSON.stringify(listing),
        });

        const data = await this.utils.handleResponse(response);
        const button = createButton(true);
        displayOverlay(
          'Your listing has been posted successfully!',
          button,
          true,
        );
        return data;
      } catch (error) {
        const button = createButton();
        displayOverlay(`Something went wrong: ${error.message} `, button);
      }
    },

    update: async (updates, id) => {
      try {
        const response = await fetch(`${this.apiBase}/auction/listings/${id}`, {
          method: 'PUT',
          headers: this.utils.setupHeaders(),
          body: JSON.stringify(updates),
        });

        const data = await this.utils.handleResponse(response);
        const button = createButton(true);
        displayOverlay(
          'Your listing has been successfully updated!',
          button,
          true,
        );
        return data;
      } catch (error) {
        const button = createButton();
        displayOverlay(`Something went wrong: ${error.message} `, button);
      }
    },

    delete: async (id) => {
      try {
        const response = await fetch(`${this.apiBase}/auction/listings/${id}`, {
          method: 'DELETE',
          headers: this.utils.setupHeaders(),
        });

        await this.utils.handleResponse(response);
        const button = createButton(true);
        displayOverlay(
          'Your listing has been successfully deleted!',
          button,
          true,
        );
      } catch (error) {
        const button = createButton();
        displayOverlay(`Something went wrong: ${error.message} `, button);
      }
    },

    bid: async (amount, id) => {
      try {
        const response = await fetch(
          `${this.apiBase}/auction/listings/${id}/bids`,
          {
            method: 'POST',
            headers: this.utils.setupHeaders(),
            body: JSON.stringify({ amount }),
          },
        );

        const data = await this.utils.handleResponse(response);
        const button = createButton(true);
        displayOverlay('Your bid has been successfully placed!', button, true);
        return data;
      } catch (error) {
        const errorContainer = document.getElementById('error-container');
        showErrorMessage(errorContainer, `${error.message}.`);
      }
    },

    search: async (query) => {
      try {
        const response = await fetch(
          `${this.apiBase}/auction/listings/search?q=${query}`,
          {
            method: 'GET',
            headers: this.utils.setupHeaders({ auth: false, apiKey: false }),
          },
        );

        const data = await this.utils.handleResponse(response);
        console.log(`Search results:`, data);
        return data;
      } catch (error) {
        console.log(error.message);
      }
    },
  };

  profile = {
    view: async () => {
      try {
        const user = getUser();
        const response = await fetch(
          `${this.apiBase}/auction/profiles/${user}`,
          {
            method: 'GET',
            headers: this.utils.setupHeaders({ json: false }),
          },
        );

        const data = await this.utils.handleResponse(response);
        console.log(`User profile:`, data);
        return data;
      } catch (error) {
        console.log(error.message);
      }
    },

    update: async (updates) => {
      try {
        const user = getUser();
        const response = await fetch(
          `${this.apiBase}/auction/profiles/${user}`,
          {
            method: 'PUT',
            headers: this.utils.setupHeaders(),
            body: JSON.stringify(updates),
          },
        );

        const data = await this.utils.handleResponse(response);
        const button = createButton(true);
        displayOverlay(
          'Your profile has been successfully updated!',
          button,
          true,
        );
        return data;
      } catch (error) {
        const button = createButton();
        displayOverlay(`Something went wrong: ${error.message} `, button);
      }
    },

    bids: async () => {
      try {
        const user = getUser();
        const response = await fetch(
          `${this.apiBase}/auction/profiles/${user}/bids?_listings=true`,
          {
            method: 'GET',
            headers: this.utils.setupHeaders({ json: false }),
          },
        );

        const data = await this.utils.handleResponse(response);
        console.log(`Users bids:`, data);
        return data;
      } catch (error) {
        console.log(error.message);
      }
    },

    listings: async () => {
      try {
        const user = getUser();
        const response = await fetch(
          `${this.apiBase}/auction/profiles/${user}/listings?_bids=true`,
          {
            method: 'GET',
            headers: this.utils.setupHeaders({ json: false }),
          },
        );

        const data = await this.utils.handleResponse(response);
        console.log(`Users listings:`, data);
        return data;
      } catch (error) {
        console.log(error.message);
      }
    },

    wins: async () => {
      try {
        const user = getUser();
        const response = await fetch(
          `${this.apiBase}/auction/profiles/${user}/wins`,
          {
            method: 'GET',
            headers: this.utils.setupHeaders({ json: false }),
          },
        );

        const data = await this.utils.handleResponse(response);
        console.log(`Users wins:`, data);
        return data;
      } catch (error) {
        console.log(error.message);
      }
    },
  };
}

// Todo:
// Make sure all functions have proper error handling
