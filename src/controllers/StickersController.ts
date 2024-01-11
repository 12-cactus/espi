import { Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

import BaseController from './BaseController';
import stickers from '../core/stickers';

export default class StickersController extends BaseController {
  static async replyWithSticker(ctx: Context<Update>, stickerPromise: Promise<string>) {
    const sticker = await stickerPromise;
    if (!sticker) {
      await ctx.reply('Acá debería venir un sticker pero no lo encontré :(');
    }

    await ctx.replyWithSticker(sticker);
  }

  static async replyWithMaybeFacu(ctx: Context<Update>) {
    await StickersController.replyWithSticker(ctx, stickers.maybeFacu());
  }

  static async replyWithPaintedDog(ctx: Context<Update>) {
    await StickersController.replyWithSticker(ctx, stickers.paintedDog());
  }

  static async replyWithPatternMatchingDan(ctx: Context<Update>) {
    await StickersController.replyWithSticker(ctx, stickers.patternMatchingDan());
  }
}
