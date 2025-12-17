import express, { NextFunction, Request, Response } from 'express';
import { handlePayment } from '../../controllers/payment';
import { validateBody, validateParams } from '../../middlewares/validate';
import { PaymentDTO, PaymentSchema } from '../../schemas/payment.schema';
import { UserIdParam, UserIdParamSchema } from '../../schemas/user.schema';

const router = express.Router();

//router.get('')

router.post('/:userId', validateParams(UserIdParamSchema), validateBody(PaymentSchema), (req: Request<UserIdParam, any, PaymentDTO>, res: Response, next: NextFunction) => {
    Promise.resolve(handlePayment(req, res)).catch(next)
});

export default router;