import { EspiContext } from './types';

export const showTypingAction = (ctx: EspiContext) => {
  ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
};
