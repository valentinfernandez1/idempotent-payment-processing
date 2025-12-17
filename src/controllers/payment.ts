import { Request, Response } from "express";
import { extractJWT, JwtPayload } from "../utils/auth/auth";
import { PaymentDTO } from "../schemas/payment.schema";
import { UserIdParam } from "../schemas/user.schema";
import { RequestError } from "../utils/errors";
import { getUserById, updateUsersBalance } from "../db/queries/users";

export async function handlePayment(req: Request<UserIdParam, any, PaymentDTO>, res: Response){
    const { amount, recipient } = req.body;
    const {userId} = req.params;
    const token: JwtPayload = extractJWT(req);

    if (token.sub !== userId) throw new RequestError("Forbidden", "Not allowed to access this resource");

    const sender = await getUserById(Number(userId));
    if(!sender) throw new RequestError("NotFound", `User not found`);
    
    const paymentRecipient = await getUserById(recipient);
    if(!paymentRecipient) throw new RequestError("NotFound", `Recipient not found`);

    if(sender.balance < amount) throw new RequestError("UnprocessableEntity", "Insufficient balance");

    const result = await updateUsersBalance({
        [sender.id]: {decrement: amount},
        [paymentRecipient.id]: {increment: amount}
    })


    res.status(200).json({message: "Payment was succesful", result})
}