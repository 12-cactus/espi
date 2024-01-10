import { Context, NarrowedContext } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

export type EspiContext = NarrowedContext<Context, Update.MessageUpdate>;
