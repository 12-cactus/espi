import { Request, Response } from 'express';
import { Context, NarrowedContext } from 'telegraf';
import { Message, Sticker, Update } from 'telegraf/typings/core/types/typegram';
import { LongWeekend } from '../core/long-weekend';

/* Express Request/Response Types */

export interface GetMeResponse extends Response {
  send: (message: string) => any;
}

export interface GetStickerRequest extends Request {
  params: { collection: string; emoji: string };
}

export interface GetStickerResponse extends Response {
  json: (data: Sticker) => any;
}

export interface GetLongWeekendResponse extends Response {
  json: (data: LongWeekend[]) => any;
}

/* Telegraf Context Types */

export type BaseContext = NarrowedContext<Context, Update.MessageUpdate>;

export type RegexMatchedContext = NarrowedContext<
  Context & { match: RegExpExecArray },
  Update.MessageUpdate<Message.TextMessage>
>;

export type VoiceMessageContext = NarrowedContext<Context, Update.MessageUpdate<Message.VoiceMessage>>;
