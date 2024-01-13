import { Sticker } from 'telegraf/typings/core/types/typegram';
import { espiClient } from '../lib/http-clients';
import logger from '../lib/logger';

export default class Stickers {
  static async find(collection: string, emoji: string) {
    try {
      const path = encodeURI(`/sticker/${collection}/${emoji}`);
      const { data } = await espiClient.get<Sticker>(path);
      return data.file_id as string;
    } catch (error) {
      logger.error(error);
      return Promise.resolve('');
    }
  }
}
