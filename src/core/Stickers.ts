import { Sticker } from 'telegraf/typings/core/types/typegram';
import { espiClient } from '../lib/http-clients';

export default class Stickers {
  static async find(collection: string, emoji: string) {
    const path = encodeURI(`/sticker/${collection}/${emoji}`);
    const { data } = await espiClient.get<Sticker>(path);
    return data.file_id;
  }
}
