import express, { NextFunction, Request, Response } from 'express';
import { handleUserCreation } from '../../controllers/users';
const router = express.Router()

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handleUserCreation(req, res)).catch(next)
});

export default router;