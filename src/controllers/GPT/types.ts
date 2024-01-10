import { Context, NarrowedContext } from 'telegraf';
import { Message, Update } from 'telegraf/typings/core/types/typegram';

export type TextMatchedContext = NarrowedContext<
  Context<Update> & { match: RegExpExecArray },
  Update.MessageUpdate<Message.TextMessage>
>;

export type TranscriptContext = NarrowedContext<Context<Update>, Update.MessageUpdate<Message.VoiceMessage>>;
