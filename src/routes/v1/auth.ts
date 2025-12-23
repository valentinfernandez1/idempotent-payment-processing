import express, { NextFunction, Request, Response } from 'express';
import { validateBody } from '../../middlewares/validation';
import { LoginSchema } from '../../schemas/auth.schema';
import { handleUserLogin } from '../../controllers/auth';
const router = express.Router()

router.post('/login', validateBody(LoginSchema), (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handleUserLogin(req, res)).catch(next)
});

router.post('/auth/refresh', (req: Request, res: Response, next: NextFunction) => {
});

router.post('/auth/revoke', (req: Request, res: Response, next: NextFunction) => {
});

router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
});

export default router;