const stickers = require('../lib/stickers');

const maybeFacu = async (ctx) => {
  const sticker = await stickers.find(ctx, 'docecactus', '👤');
  return ctx.replyWithSticker(sticker.file_id);
};

const iWillPaintYourDog = async (ctx) => {
  const sticker = await stickers.find(ctx, 'docecactus', '🐺');
  return ctx.replyWithSticker(sticker.file_id);
};

module.exports = { maybeFacu, iWillPaintYourDog };
