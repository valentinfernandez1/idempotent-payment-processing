import express, { NextFunction, Request, Response } from 'express';
const router = express.Router()

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
});

router.post('/auth/refresh', (req: Request, res: Response, next: NextFunction) => {
});

router.post('/auth/revoke', (req: Request, res: Response, next: NextFunction) => {
});

router.post('/logout', (req: Request, res: Response, next: NextFunction) => {
});

export default router;