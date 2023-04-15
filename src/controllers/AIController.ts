import { Context, NarrowedContext } from 'telegraf';
import { Update, Message } from 'telegraf/typings/core/types/typegram';
import AI from '../features/AI';
import config from '../config';

type ShouldRespondContext = NarrowedContext<Context<Update> & {
  match: RegExpExecArray;
}, {
  message: Update.New & Update.NonChannel & Message.TextMessage;
  update_id: number;
}>;

const validChannel = (channelId: number) => config.aiChannels.includes(channelId);

/**
 * Check is should respond to a incoming message
 */
const shouldRespond = (value: string, ctx: Context<Update>) => {
  const update = ctx.update as Update.MessageUpdate;
  if (!validChannel(update.message.chat.id)) return null;
  return /^espi +(?<question>.+)/i.exec(value);
};

/**
 * Handle incoming question asking to ChatGPT API
 */
const handleQuestion = async (ctx: ShouldRespondContext) => {
  const question = (ctx.match?.groups?.question || '').trim();
  if (question.length < 7) {
    ctx.reply('Muy cortito amigo');
    return;
  }
  const answer = await AI.ask(question);
  ctx.reply(answer);
};

const AIController = { shouldRespond, handleQuestion };

export default AIController;
