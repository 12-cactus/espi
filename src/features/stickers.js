const stickers = require('../lib/stickers');

const replyWithStickerFrom12Cactus = emoji => async (ctx) => {
  const sticker = await stickers.find(ctx, 'docecactus', emoji);
  if (sticker && sticker.file_id) {
    return ctx.replyWithSticker(sticker.file_id);
  }
  return null;
};

module.exports = { replyWithStickerFrom12Cactus };
