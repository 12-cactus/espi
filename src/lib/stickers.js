const find = async (ctx, collection, emoji) => {
  const stickers = await ctx.getStickerSet(collection);
  const sticker = stickers.stickers.find(st => st.emoji === emoji);
  if (!sticker) throw new Error('missing sticker');
  return sticker;
};

module.exports = { find };
