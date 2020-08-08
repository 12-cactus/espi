const stickers = require('../lib/stickers');

const replyWithStickerFrom12Cactus = emoji => async (ctx) => {
  const sticker = await stickers.find(ctx, 'docecactus', emoji);
  return ctx.replyWithSticker(sticker.file_id);
};

module.exports = { replyWithStickerFrom12Cactus };
