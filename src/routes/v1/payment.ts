import express, { NextFunction, Request, Response } from 'express';
import { handleGetUserPayments, handlePayment, handleTopUp } from '../../controllers/payment';
import { extractJWTMiddleware, idempotencyMiddleware, validateBody, validateParams } from '../../middlewares/validation';
import { FundDTO, FundSchema, PaymentDTO, PaymentSchema } from '../../schemas/payment.schema';
import { UserIdParam, UserIdParamSchema } from '../../schemas/user.schema';

const router = express.Router();

router.get('/:userId', validateParams(UserIdParamSchema), (req: Request<UserIdParam, any, PaymentDTO>, res: Response, next: NextFunction) => {
    Promise.resolve(handleGetUserPayments(req, res)).catch(next)
});

router.post('/', [
    validateBody(PaymentSchema), 
    extractJWTMiddleware, 
    idempotencyMiddleware
], (req: Request<any, PaymentDTO>, res: Response, next: NextFunction) => {
    Promise.resolve(handlePayment(req, res)).catch(next)
});

router.post('/topUp', validateBody(FundSchema),extractJWTMiddleware, idempotencyMiddleware, (req: Request<{},any, FundDTO>, res: Response, next: NextFunction) => {
    Promise.resolve(handleTopUp(req, res)).catch(next)
});

export default router;