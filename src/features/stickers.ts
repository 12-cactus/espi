import logger from '../logger';
import api from '../api';

const find = async (collection: string, emoji: string) => {
  try {
    const path = encodeURI(`/sticker/${collection}/${emoji}`);
    const { data } = await api.get(path);
    return data.sticker.file_id;
  } catch (error) {
    logger.error(error);
    return null;
  }
};

const Stickers = {
  find,
  maybeFacu: async () => find('docecactus', '👤'),
  paintedDog: async () => find('docecactus', '🐺'),
  patternMatchingDan: async () => find('docecactus', '🖕'),
};

export default Stickers;
