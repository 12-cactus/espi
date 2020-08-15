const logger = require('winston-ready');
const api = require('../api');

const find = async (ctx, collection, emoji) => {
  try {
    const path = encodeURI(`/sticker/${collection}/${emoji}`);
    const { data } = await api.get(path);
    return data.sticker;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

module.exports = { find };
