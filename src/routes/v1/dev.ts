import express, { NextFunction, Request, Response } from 'express';
import { handleGrantFreeBalance, handleReset } from '../../controllers/dev';
import { validateBody } from '../../middlewares/validate';
import { GrantSchema } from '../../schemas/admin.schema';
import { getIdempotencyHeader } from '../../utils/utils';
const router = express.Router()

router.get('/reset',(req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handleReset(req, res)).catch(next);
});

router.put('/grant', validateBody(GrantSchema),(req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handleGrantFreeBalance(req, res)).catch(next);
});

export default router;