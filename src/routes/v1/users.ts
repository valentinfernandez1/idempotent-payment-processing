import express, { NextFunction, Request, Response } from 'express';
import { handleGetUserByEmail, handleUserCreation } from '../../controllers/users';
import { validateBody, validateParams } from '../../middlewares/validate';
import { CreateUserSchema, EmailParam, EmailParamSchema } from '../../schemas/user.schema';
const router = express.Router()

router.get('/:email', validateParams(EmailParamSchema),(req: Request<EmailParam>, res: Response, next: NextFunction) => {
  Promise.resolve(handleGetUserByEmail(req, res)).catch(next)
 });

router.post('/', validateBody(CreateUserSchema),(req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(handleUserCreation(req, res)).catch(next)
});


export default router;