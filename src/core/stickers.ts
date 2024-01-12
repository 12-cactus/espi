import { EspiClient } from '../lib/http-clients';
import logger from '../lib/logger';

const find = async (collection: string, emoji: string) => {
  try {
    const path = encodeURI(`/sticker/${collection}/${emoji}`);
    const { data } = await EspiClient.get(path);
    return data.sticker.file_id as string;
  } catch (error) {
    logger.error(error);
    return Promise.resolve('');
  }
};

const Stickers = {
  find,
  maybeFacu: async () => find('docecactus', '👤'),
  paintedDog: async () => find('docecactus', '🐺'),
  patternMatchingDan: async () => find('docecactus', '🖕'),
};

export default Stickers;
