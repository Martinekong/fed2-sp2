import { BASE_URL, API_KEY } from './utils/constants.js';
import { saveToken, getToken, saveUser, getUser } from './utils/storage.js';

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
          `${this.apiBase}/auction/listings?_active=true`,
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
        const response = await fetch(`${this.apiBase}/auction/listings/${id}`, {
          method: 'GET',
          headers: this.utils.setupHeaders({ auth: false, apiKey: false }),
        });

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
        console.log(`New listing:`, data);
        return data;
      } catch (error) {
        console.log(error.message);
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
        console.log(`Updated listing:`, data);
        return data;
      } catch (error) {
        console.log(error.message);
      }
    },

    delete: async (id) => {
      try {
        const response = await fetch(`${this.apiBase}/auction/listings/${id}`, {
          method: 'DELETE',
          headers: this.utils.setupHeaders(),
        });

        await this.utils.handleResponse(response);
        console.log('Listing deleted');
      } catch (error) {
        console.log(error.message);
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
        console.log(`Bid has been placed:`, data);
        return data;
      } catch (error) {
        console.log(error.message);
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
        console.log(`Updated profile:`, data);
        return data;
      } catch (error) {
        console.log(error.message);
      }
    },

    bids: async () => {
      try {
        const user = getUser();
        const response = await fetch(
          `${this.apiBase}/auction/profiles/${user}/bids`,
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
          `${this.apiBase}/auction/profiles/${user}/listings`,
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
