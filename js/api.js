import { BASE_URL, API_KEY } from './utils/constants.js';
import { getToken, getUser } from './utils/storage.js';

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
      const response = await fetch(`${this.apiBase}/auth/login`, {
        method: 'POST',
        headers: this.utils.setupHeaders({ auth: false, apiKey: false }),
        body: JSON.stringify({ email, password }),
      });
      return await this.utils.handleResponse(response);
    },

    register: async ({ name, email, password }) => {
      const response = await fetch(`${this.apiBase}/auth/register`, {
        method: 'POST',
        headers: this.utils.setupHeaders({ auth: false, apiKey: false }),
        body: JSON.stringify({ name, email, password }),
      });
      return await this.utils.handleResponse(response);
    },
  };

  listings = {
    viewAll: async () => {
      const response = await fetch(
        `${this.apiBase}/auction/listings?_active=true&_bids=true`,
        {
          method: 'GET',
          headers: this.utils.setupHeaders({ auth: false, apiKey: false }),
        },
      );
      return await this.utils.handleResponse(response);
    },

    viewSingle: async (id) => {
      const response = await fetch(
        `${this.apiBase}/auction/listings/${id}?_seller=true&_bids=true`,
        {
          method: 'GET',
          headers: this.utils.setupHeaders({ auth: false, apiKey: false }),
        },
      );
      return await this.utils.handleResponse(response);
    },

    create: async (listing) => {
      const response = await fetch(`${this.apiBase}/auction/listings`, {
        method: 'POST',
        headers: this.utils.setupHeaders(),
        body: JSON.stringify(listing),
      });
      return await this.utils.handleResponse(response);
    },

    update: async (updates, id) => {
      const response = await fetch(`${this.apiBase}/auction/listings/${id}`, {
        method: 'PUT',
        headers: this.utils.setupHeaders(),
        body: JSON.stringify(updates),
      });
      return await this.utils.handleResponse(response);
    },

    delete: async (id) => {
      const response = await fetch(`${this.apiBase}/auction/listings/${id}`, {
        method: 'DELETE',
        headers: this.utils.setupHeaders(),
      });
      return this.utils.handleResponse(response);
    },

    bid: async (amount, id) => {
      const response = await fetch(
        `${this.apiBase}/auction/listings/${id}/bids`,
        {
          method: 'POST',
          headers: this.utils.setupHeaders(),
          body: JSON.stringify({ amount }),
        },
      );
      return await this.utils.handleResponse(response);
    },

    search: async (query) => {
      const response = await fetch(
        `${this.apiBase}/auction/listings/search?q=${query}`,
        {
          method: 'GET',
          headers: this.utils.setupHeaders({ auth: false, apiKey: false }),
        },
      );
      return await this.utils.handleResponse(response);
    },
  };

  profile = {
    view: async () => {
      const user = getUser();
      const response = await fetch(`${this.apiBase}/auction/profiles/${user}`, {
        method: 'GET',
        headers: this.utils.setupHeaders({ json: false }),
      });
      return await this.utils.handleResponse(response);
    },

    update: async (updates) => {
      const user = getUser();
      const response = await fetch(`${this.apiBase}/auction/profiles/${user}`, {
        method: 'PUT',
        headers: this.utils.setupHeaders(),
        body: JSON.stringify(updates),
      });
      return await this.utils.handleResponse(response);
    },

    bids: async () => {
      const user = getUser();
      const response = await fetch(
        `${this.apiBase}/auction/profiles/${user}/bids?_listings=true`,
        {
          method: 'GET',
          headers: this.utils.setupHeaders({ json: false }),
        },
      );
      return await this.utils.handleResponse(response);
    },

    listings: async () => {
      const user = getUser();
      const response = await fetch(
        `${this.apiBase}/auction/profiles/${user}/listings?_bids=true`,
        {
          method: 'GET',
          headers: this.utils.setupHeaders({ json: false }),
        },
      );
      return await this.utils.handleResponse(response);
    },

    wins: async () => {
      const user = getUser();
      const response = await fetch(
        `${this.apiBase}/auction/profiles/${user}/wins`,
        {
          method: 'GET',
          headers: this.utils.setupHeaders({ json: false }),
        },
      );
      return await this.utils.handleResponse(response);
    },
  };
}

// Todo:
// Add user wins to profile?
