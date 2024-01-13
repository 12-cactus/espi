import { Request } from 'express';
import { version } from '../../package.json';
import bot from '../bot';
import Holidays from '../core/holidays';
import BadRequestResponse from '../exceptions/BadRequestResponse';
import { GetLongWeekendResponse, GetMeResponse, GetStickerRequest, GetStickerResponse } from './types';

/**
 * APIController
 */
export default class APIController {
  /**
   * GET /
   * @param {Request} req
   * @param {GetMeResponse} res
   */
  static async getMe(req: Request, res: GetMeResponse) {
    const me = await bot.telegram.getMe();
    res.send(`I'm ${me.first_name} @${version}`);
  }

  /**
   * GET /sticker/:collection/:emoji
   * @param {GetStickerRequest} req
   * @param {GetStickerResponse} res
   * @throws BadRequestResponse
   */
  static async getSticker(req: GetStickerRequest, res: GetStickerResponse) {
    const { collection, emoji } = req.params;
    const stickers = await bot.telegram.getStickerSet(collection);
    const sticker = stickers.stickers.find(st => st.emoji === emoji);
    if (!sticker) throw new BadRequestResponse(`Sticker ${emoji} not found in ${collection}`);

    res.status(200).json(sticker);
  }

  /**
   * GET /long-weekend/
   * @param {Request} req
   * @param {GetLongWeekendResponse} res
   */
  static async getLongWeekend(req: Request, res: GetLongWeekendResponse) {
    const longWeekends = await Holidays.findNextLongWeekendsAR();
    res.status(200).json(longWeekends);
  }
}
