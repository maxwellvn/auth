const API_BASE_URL = 'http://localhost/template/TechStartup/backend/api';

export const authAPI = {
  login: async (email, name, contact) => {
    const response = await fetch(`${API_BASE_URL}/auth.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, name, contact }),
    });
    return response.json();
  },
};

export const bookingsAPI = {
  getAll: async (email = null, date = null) => {
    let url = `${API_BASE_URL}/bookings.php`;
    const params = new URLSearchParams();
    if (email) params.append('email', email);
    if (date) params.append('date', date);
    if (params.toString()) url += `?${params.toString()}`;

    const response = await fetch(url);
    return response.json();
  },

  create: async (bookingData) => {
    const response = await fetch(`${API_BASE_URL}/bookings.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });
    return response.json();
  },

  update: async (id, updates) => {
    const response = await fetch(`${API_BASE_URL}/bookings.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, ...updates }),
    });
    return response.json();
  },

  cancel: async (id) => {
    const response = await fetch(`${API_BASE_URL}/bookings.php?id=${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};
