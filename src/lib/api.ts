import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.API_DOMAIN || process.env.BOT_DOMAIN,
  headers: {
    'Content-type': 'application/json',
  },
});

export default instance;
