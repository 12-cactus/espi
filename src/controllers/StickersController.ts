import Stickers from '../core/Stickers';
import logger from '../lib/logger';
import BaseController from './BaseController';
import { BaseContext } from './types';

export default class StickersController extends BaseController {
  static async replyWithSticker(ctx: BaseContext, collection: string, emoji: string) {
    try {
      const sticker = await Stickers.find(collection, emoji);
      await ctx.replyWithSticker(sticker);
    } catch (error) {
      logger.error(error);
      await ctx.reply('Hubo un error al buscar el sticker :(');
    }
  }
}
