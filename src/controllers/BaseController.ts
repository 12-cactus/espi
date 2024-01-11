import { BaseContext } from './types';

export default class BaseController {
  static showTypingAction(ctx: BaseContext) {
    ctx.telegram.sendChatAction(ctx.chat.id, 'typing');
  }
}
