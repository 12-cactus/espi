import { Context, NarrowedContext } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

import { aiChannels } from '../config';

type GPTMiddlewareContext = NarrowedContext<Context<Update>, Update.MessageUpdate>;

export default class GPTMiddleware {
  static authorizedChannel(ctx: GPTMiddlewareContext, next: () => Promise<void>) {
    const isValidChannel = aiChannels.includes(ctx.chat.id);
    if (!isValidChannel) return;

    // All good, continue
    return next();
  }
}
