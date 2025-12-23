import express, { NextFunction, Request, Response } from 'express';
import bodyParser from "body-parser";
import { stripeWebhookHandler } from '../controllers/webhooks';
const router = express.Router()

router.post("/stripe", bodyParser.raw({ type: "application/json" }), (req: Request, res: Response, next: NextFunction) => {
    return Promise.resolve(stripeWebhookHandler(req, res)).catch(next)
});


export default router;