import express, { NextFunction, Request, Response } from 'express';
import { handleGetUserPayments, handlePayment } from '../../controllers/payment';
import { validateBody, validateParams } from '../../middlewares/validate';
import { PaymentDTO, PaymentSchema } from '../../schemas/payment.schema';
import { UserIdParam, UserIdParamSchema } from '../../schemas/user.schema';

const router = express.Router();

router.get('/:userId', validateParams(UserIdParamSchema), (req: Request<UserIdParam, any, PaymentDTO>, res: Response, next: NextFunction) => {
    Promise.resolve(handleGetUserPayments(req, res)).catch(next)
});

router.post('/:userId', validateParams(UserIdParamSchema), validateBody(PaymentSchema), (req: Request<UserIdParam, any, PaymentDTO>, res: Response, next: NextFunction) => {
    Promise.resolve(handlePayment(req, res)).catch(next)
});

export default router;