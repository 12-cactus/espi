const express = require('express');
const bot = require('./bot');
const { version } = require('../package.json');

const router = express.Router();

// Express root endpoint
router.get('/', async (req, res) => {
  const me = await bot.telegram.getMe();
  res.send(`I'm ${me.first_name} @${version}`);
});

router.get('/espi', async (req, res) => {
  const me = await bot.telegram.getMe();
  res.send(`I'm ${me.first_name}`);
});

module.exports = router;
