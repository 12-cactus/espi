import axios from 'axios';

const api = axios.create({
  baseURL: process.env.API_DOMAIN || process.env.BOT_DOMAIN,
  headers: {
    'Content-type': 'application/json',
  },
});

export default api;
