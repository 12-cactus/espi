require('dotenv').config();
const axios = require('axios');

const { BOT_DOMAIN } = process.env;

const instance = axios.create({
  baseURL: BOT_DOMAIN,
  headers: {
    'Content-type': 'application/json',
  },
});

module.exports = instance;
