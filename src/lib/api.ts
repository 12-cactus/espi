import axios from 'axios';
import { gitHubToken } from '../config';

const api = axios.create({
  baseURL: process.env.API_DOMAIN || process.env.BOT_DOMAIN,
  headers: {
    'Content-type': 'application/json',
  },
});

export const GitHubAPI = axios.create({
  baseURL: `https://api.github.com/repos/12-cactus/espi`,
  headers: {
    Authorization: `Bearer ${gitHubToken}`,
    'Content-Type': 'application/json',
  },
});

export default api;
