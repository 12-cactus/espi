import fs from 'fs';

import { ChatCompletionMessageParam } from 'openai/resources';
import { Context, NarrowedContext } from 'telegraf';
import { Message, Update } from 'telegraf/typings/core/types/typegram';

import { aiChannels, espiId } from '../config';
import AI from '../features/AI';
import api from '../lib/api';

type TextMatchedContext = NarrowedContext<
  Context<Update> & { match: RegExpExecArray },
  Update.MessageUpdate<Message.TextMessage>
>;

type TranscriptContext = NarrowedContext<Context<Update>, Update.MessageUpdate<Message.VoiceMessage>>;

const validChannel = (channelId: number) => aiChannels.includes(channelId);

export default class AIController {
  /**
   * Check is should respond to a incoming message
   */
  static shouldRespond(value: string, ctx: Context<Update>) {
    const update = ctx.update as Update.MessageUpdate;
    if (!validChannel(update.message.chat.id)) return null;
    return /^espi +(?<question>.+)/i.exec(value);
  }

  /**
   * Handle incoming question asking to ChatGPT API
   */
  static async handleQuestion(ctx: TextMatchedContext) {
    const question = (ctx.match?.groups?.question || '').trim();
    if (question.length < 7) {
      ctx.reply('Muy cortito amigo');
      return;
    }

    const reply = ctx.message.reply_to_message as Message.TextMessage;
    const contextText = reply?.text || '';
    const contextRole = reply?.from?.id === espiId ? 'system' : 'user';
    const context: ChatCompletionMessageParam | undefined = contextText
      ? { role: contextRole, content: contextText }
      : undefined;
    const answer = await AI.ask(question, context);
    ctx.reply(answer);
  }

  static async transcriptAudio(ctx: TranscriptContext) {
    // TODO:
    // - Filtering by user in AI_CHANNELS
    // - Filtering by voice duration/size
    // - Quick send a message saying "transcribing..." and then edit it with the transcription
    const voice = ctx.message?.voice;
    const tmpFile = `./voice-${ctx.message?.message_id}.mp3`;
    const link = await ctx.telegram.getFileLink(voice.file_id);
    const res = await api.get(link.href, { responseType: 'arraybuffer' });
    await fs.promises.writeFile(tmpFile, res.data);
    const transcription = await AI.transcript(tmpFile);
    ctx.reply(transcription);
    await fs.promises.rm(tmpFile);
  }
}
