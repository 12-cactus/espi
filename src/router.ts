import express, { NextFunction, Request, Response } from 'express';
import bot from './bot';
import { version } from '../package.json';
import BadRequestResponse from './exceptions/BadRequestResponse';
import Holidays from './features/holidays';

const router = express.Router();

type CallbackFn = (req: Request, res: Response, next: express.NextFunction) => ({});

const handling = (callback: CallbackFn) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    return callback(req, res, next);
  } catch (error) {
    return next(error);
  }
};

// Express root endpoint
router.get('/', handling(async (req, res) => {
  const me = await bot.telegram.getMe();
  res.send(`I'm ${me.first_name} @${version}`);
}));

router.get('/sticker/:collection/:emoji', handling(async (req, res) => {
  const { collection, emoji } = req.params;
  const stickers = await bot.telegram.getStickerSet(collection);
  const sticker = stickers.stickers.find(st => st.emoji === emoji);
  if (!sticker) throw new BadRequestResponse(`Sticker ${emoji} not found in ${collection}`);

  res.status(200).json({ sticker });
}));

router.get('/long-weekend/', handling(async (req, res) => {
  const longWeekends = await Holidays.findNextLongWeekendsAR();
  res.status(200).json(longWeekends);
}));

export default router;
