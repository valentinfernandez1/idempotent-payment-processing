import express, { NextFunction, Request, Response } from 'express';
import { handleGetUserByEmail, handleUserCreation } from '../../controllers/users';
const router = express.Router()

router.get('/:email', (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handleGetUserByEmail(req, res)).catch(next)
 });

router.post('/', (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handleUserCreation(req, res)).catch(next)
});


export default router;