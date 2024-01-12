import { Context, NarrowedContext } from 'telegraf';
import { Message, Update } from 'telegraf/typings/core/types/typegram';

export type BaseContext = NarrowedContext<Context, Update.MessageUpdate>;

export type RegexMatchedContext = NarrowedContext<
  Context & { match: RegExpExecArray },
  Update.MessageUpdate<Message.TextMessage>
>;

export type VoiceMessageContext = NarrowedContext<Context, Update.MessageUpdate<Message.VoiceMessage>>;
