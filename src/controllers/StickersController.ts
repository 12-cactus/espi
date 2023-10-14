import { Context } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

import stickers from '../features/stickers';

const StickersController = {
  replyWithSticker: async (ctx: Context<Update>, stickerPromise: Promise<string>) => {
    const sticker = await stickerPromise;
    if (!sticker) {
      await ctx.reply('Acá debería venir un sticker pero no lo encontré :(');
    }

    await ctx.replyWithSticker(sticker);
  },

  replyWithMaybeFacu: async (ctx: Context<Update>) => {
    await StickersController.replyWithSticker(ctx, stickers.maybeFacu());
  },

  replyWithPaintedDog: async (ctx: Context<Update>) => {
    await StickersController.replyWithSticker(ctx, stickers.paintedDog());
  },

  replyWithPatternMatchingDan: async (ctx: Context<Update>) => {
    await StickersController.replyWithSticker(ctx, stickers.patternMatchingDan());
  },
};

export default StickersController;
