import axios from 'axios';
import { gitHubToken } from '../config';

/**
 * Axios client for general purpose
 */
export const axiosClient = axios.create();

/**
 * Axios client for Espi API (see router.ts for endpoints)
 */
export const espiClient = axios.create({
  baseURL: process.env.API_DOMAIN || process.env.BOT_DOMAIN,
  headers: {
    'Content-type': 'application/json',
  },
});

/**
 * Axios client for GitHub API
 */
export const githubClient = axios.create({
  baseURL: `https://api.github.com/repos/12-cactus/espi`,
  headers: {
    Authorization: `Bearer ${gitHubToken}`,
    'Content-Type': 'application/json',
  },
});
