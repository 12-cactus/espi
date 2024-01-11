import { Context, NarrowedContext } from 'telegraf';
import { Update } from 'telegraf/typings/core/types/typegram';

export type BaseContext = NarrowedContext<Context, Update.MessageUpdate>;
