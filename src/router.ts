import { NextFunction, Request, Response, Router } from 'express';
import APIController from './controllers/APIController';

const router = Router();

type CallbackFn = (req: any, res: any, next: NextFunction) => any;

const handling = (callback: CallbackFn) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    return callback(req, res, next);
  } catch (error) {
    return next(error);
  }
};

router.get('/', handling(APIController.getMe));
router.get('/sticker/:collection/:emoji', handling(APIController.getSticker));
router.get('/long-weekend/', handling(APIController.getLongWeekend));

export default router;
