const express = require('express');
const bot = require('./bot');
const { version } = require('../package.json');
const { BadRequestResponse } = require('./lib/api-exceptions');

const router = express.Router();

const handling = callback => async (req, res, next) => {
  try {
    return await callback(req, res, next);
  } catch (error) {
    return next(error);
  }
};

// Express root endpoint
router.get('/', handling(async (req, res) => {
  const me = await bot.telegram.getMe();
  res.send(`I'm ${me.first_name} @${version}`);
}));

router.get('/sticker/:collection/:emoji', handling(async (req, res) => {
  const { collection, emoji } = req.params;
  const stickers = await bot.telegram.getStickerSet(collection);
  const sticker = stickers.stickers.find(st => st.emoji === emoji);
  if (!sticker) throw new BadRequestResponse(`Sticker ${emoji} not found in ${collection}`);

  res.status(200).json({ sticker });
}));

module.exports = router;
