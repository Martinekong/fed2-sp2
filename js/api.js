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
  };

  auth = {
    login: async ({ email, password }) => {
      try {
        const response = await fetch(`${this.apiBase}/auth/login`, {
          method: 'POST',
          headers: this.utils.setupHeaders({ auth: false, apiKey: false }),
          body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
          console.log(response);
        }

        const { data } = await response.json();

        console.log(`Logged in user:`, data);
        saveToken(data.accessToken);
        saveUser(data.name);
        return data;
      } catch (error) {
        console.log(error);
      }
    },

    register: async ({ name, email, password }) => {
      try {
        const response = await fetch(`${this.apiBase}/auth/register`, {
          method: 'POST',
          headers: this.utils.setupHeaders({ auth: false, apiKey: false }),
          body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
          console.log(response);
        }

        const { data } = await response.json();

        console.log(`Registered user:`, data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },

    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
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

        if (!response.ok) {
          console.log(response);
        }

        const { data } = await response.json();

        console.log(`All listings:`, data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },

    viewSingle: async (id) => {
      try {
        const response = await fetch(`${this.apiBase}/auction/listings/${id}`, {
          method: 'GET',
          headers: this.utils.setupHeaders({ auth: false, apiKey: false }),
        });

        if (!response.ok) {
          console.log(response);
        }

        const { data } = await response.json();

        console.log(`Single listing:`, data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },

    create: async (listing) => {
      try {
        const response = await fetch(`${this.apiBase}/auction/listings`, {
          method: 'POST',
          headers: this.utils.setupHeaders(),
          body: JSON.stringify(listing),
        });

        if (!response.ok) {
          console.log(response);
        }

        const { data } = await response.json();

        console.log(`New listing:`, data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },

    update: async (updates, id) => {
      try {
        const response = await fetch(`${this.apiBase}/auction/listings/${id}`, {
          method: 'PUT',
          headers: this.utils.setupHeaders(),
          body: JSON.stringify(updates),
        });

        if (!response.ok) {
          console.log(response);
        }

        const { data } = await response.json();

        console.log(`Updated listing:`, data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },

    delete: async (id) => {
      try {
        const response = await fetch(`${this.apiBase}/auction/listings/${id}`, {
          method: 'DELETE',
          headers: this.utils.setupHeaders(),
        });

        if (!response.ok) {
          console.log(response);
        }

        console.log('Listing deleted');
      } catch (error) {
        console.log(error);
      }
    },

    bid: async (amount, id) => {
      try {
        const response = await fetch(
          `${this.apiBase}/auction/listings/${id}/bids`,
          {
            method: 'POST',
            headers: this.utils.setupHeaders({ auth: false, apiKey: false }),
            body: JSON.stringify(amount),
          },
        );

        if (!response.ok) {
          console.log(response);
        }

        const { data } = await response.json();

        console.log(`Bid has been placed:`, data);
        return data;
      } catch (error) {
        console.log(error);
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

        if (!response.ok) {
          console.log(response);
        }

        const { data } = await response.json();

        console.log(`Search results:`, data);
        return data;
      } catch (error) {
        console.log(error);
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

        if (!response.ok) {
          console.log(response);
        }

        const { data } = await response.json();

        console.log(`User profile:`, data);
        return data;
      } catch (error) {
        console.log(error);
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

        if (!response.ok) {
          console.log(response);
        }

        const { data } = await response.json();

        console.log(`Updated profile:`, data);
        return data;
      } catch (error) {
        console.log(error);
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

        if (!response.ok) {
          console.log(response);
        }

        const { data } = await response.json();

        console.log(`Users bids:`, data);
        return data;
      } catch (error) {
        console.log(error);
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

        if (!response.ok) {
          console.log(response);
        }

        const { data } = await response.json();

        console.log(`Users listings:`, data);
        return data;
      } catch (error) {
        console.log(error);
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

        if (!response.ok) {
          console.log(response);
        }

        const { data } = await response.json();

        console.log(`Users wins:`, data);
        return data;
      } catch (error) {
        console.log(error);
      }
    },
  };
}
