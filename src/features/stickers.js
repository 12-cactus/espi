const logger = require('winston-ready');
const api = require('../api');

const find = async (collection, emoji) => {
  try {
    const path = encodeURI(`/sticker/${collection}/${emoji}`);
    const { data } = await api.get(path);
    return data.sticker.file_id;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

module.exports = {
  find,
  maybeFacu: async () => find('docecactus', '👤'),
  paintedDog: async () => find('docecactus', '🐺'),
  patternMatchingDan: async () => find('docecactus', '🖕'),
};
