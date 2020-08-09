const find = async (ctx, collection, emoji) => {
  try {
    const stickers = await ctx.getStickerSet(collection);
    const sticker = stickers.stickers.find(st => st.emoji === emoji);
    if (!sticker) throw new Error('missing sticker');
    return sticker;
  } catch (error) {
    console.error('something wrong');
    console.error(error);
    return null; // FIXME: no sé por qué esa mierda se rompe en prod en el start. Revisar.
  }
};

module.exports = { find };
