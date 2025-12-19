import { Request, Response } from "express";
import { extractJWT, JwtPayload } from "../utils/auth/auth";
import { PaymentDTO } from "../schemas/payment.schema";
import { UserIdParam } from "../schemas/user.schema";
import { RequestError } from "../utils/errors";
import { getUserById } from "../db/queries/users";
import { getIdempotencyHeader } from "../utils/utils";
import { consolidatePayment, createPayment, getIdempotencyKey, getUserPayments } from "../db/queries/payment.js";

//Currently handlePayment does eveything but when stripe gets integrated it will just validate, create the payment and idempo records and return a 202.
export async function handlePayment(req: Request<UserIdParam, any, PaymentDTO>, res: Response){
    const { amount, recipient } = req.body;
    const {userId} = req.params;
    const token: JwtPayload = extractJWT(req);
    
    if (token.sub !== userId) throw new RequestError("Forbidden", "Not allowed to access this resource");
    
    const sender = await getUserById(Number(userId));
    if(!sender) throw new RequestError("NotFound", `User not found`);
    
    const paymentRecipient = await getUserById(recipient);
    if(!paymentRecipient) throw new RequestError("NotFound", `Recipient not found`);

    //TODO: Check Idempotency key existance
    const idempoKey = getIdempotencyHeader(req);

    // TODO: First should check on redis for faster lookups

    if(await getIdempotencyKey(idempoKey)) throw new RequestError("UnprocessableEntity", "Duplicated payment request");


    const payment = await createPayment({
            amount, 
            recipientId: recipient, 
            senderId: sender.id
        }, 
        idempoKey
    );  
    
    if(sender.balance < amount) {
        await consolidatePayment(payment.id, "REJECTED", "Insufficient balance");
        throw new RequestError("UnprocessableEntity", "Insufficient balance");
    };

    const result = await consolidatePayment(payment.id, "APPROVED", "Payment was succesful via Stripe");

    res.status(200).json({message: "Payment was succesful", body: result})
}

export async function handleGetUserPayments(req: Request<UserIdParam>, res: Response){
    const {userId} = req.params;

    const userPayments = await getUserPayments(Number(userId))
    
    res.status(200).json({body:userPayments})
}