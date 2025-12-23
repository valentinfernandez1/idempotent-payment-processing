import express, { NextFunction, Request, Response } from 'express';
import { handleGrantFreeBalance, handleReset } from '../../controllers/dev';
import { validateBody } from '../../middlewares/validation';
import { GrantSchema } from '../../schemas/admin.schema';
const router = express.Router()

router.get('/reset',(req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handleReset(req, res)).catch(next);
});

router.put('/grant', validateBody(GrantSchema),(req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handleGrantFreeBalance(req, res)).catch(next);
});

router.get('/test', (req: Request, res: Response, next: NextFunction) => {
  console.log("executing")
  return res.status(200).json("ok");
});
export default router;