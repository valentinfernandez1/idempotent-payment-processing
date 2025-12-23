import { Request, Response } from "express";
import { UserIdParam } from "../schemas/user.schema";
import { RequestError } from "../utils/errors";
import { getUserById } from "../db/queries/users";
import { getIdempotencyHeader } from "../utils/utils";
import { consolidatePayment, createPayment, getIdempotencyKey, getUserPayments } from "../db/queries/payment.js";
import { FundDTO, PaymentDTO } from "../schemas/payment.schema";
import Stripe from "stripe";
import { config } from "../config";
import { PaymentTypes } from "../types/types";
const stripe = new Stripe(config.api.stripe);

export async function handlePayment(req: Request<{}, any, PaymentDTO>, res: Response){
    const { amount, recipient } = req.body;
    const userId = req.auth!.sub;
    
    await new Promise<void>((resolve) => {
        setTimeout(resolve, 3000); // 1 second
    });
    const sender = await getUserById(Number(userId));
    if(!sender) throw new RequestError("NotFound", `User not found`);
    
    const paymentRecipient = await getUserById(recipient);
    if(!paymentRecipient) throw new RequestError("NotFound", `Recipient not found`);

    const payment = await createPayment({
            amount, 
            recipientId: recipient, 
            senderId: sender.id
        }, 
        req.idempotencyKey!
    );  
    
    if(sender.balance < amount) {
        await consolidatePayment(payment.id, "REJECTED", "Insufficient balance");
        throw new RequestError("UnprocessableEntity", "Insufficient balance");
    };

    const result = await consolidatePayment(payment.id, "APPROVED", "Payment was succesful via Stripe");
    
    const response = {message: "Payment was succesful", body: result}
    res.locals.idempotentResponse = response
    res.status(200).json(response)
}

export async function handleGetUserPayments(req: Request<UserIdParam>, res: Response){
    const {userId} = req.params;

    const userPayments = await getUserPayments(Number(userId))
    
    res.status(200).json({body:userPayments})
}

export async function handleTopUp(req: Request<{}, any, FundDTO>, res: Response){
    const userId = Number(req.auth!.sub);
    const {amount} = req.body;

    const account = await getUserById(userId);
    if(!account) throw new RequestError("NotFound", `User not found`);

    const topUp = await createPayment({
            amount, 
            recipientId: userId, 
            senderId: userId,
        }, 
        req.idempotencyKey!
    );  

    const intent: Stripe.PaymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), 
        currency: 'usd',   
        payment_method: 'pm_card_visa', //Testing card
        automatic_payment_methods: {
            enabled: true,
            allow_redirects: "never",
        },
        confirm: true,
        metadata: {
            paymentId: topUp.id,
            userId,
            type: PaymentTypes.TOP_UP
        }
    });
    
    res.status(202).json({message: "Payment processing", body: {
        paymentId: topUp.id,
        userId,
        stripeIntentId: intent.id,
        status: intent.status
    }})
}