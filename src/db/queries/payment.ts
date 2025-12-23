import { Status } from "../../generated/prisma/enums";
import { RequestError } from "../../utils/errors";
import { prisma } from "../prisma";

export async function createPayment(payment: {amount: number, senderId: number, recipientId: number}, idempotencyKey: string, ){
    const {amount,recipientId,senderId}= payment
    return await prisma.payment.create({
        data: {
            amount,
            senderId,
            recipientId,
            idempotencyKey: {
                create: {
                    id: idempotencyKey,
                },
            },
        },
    });
}

export async function consolidatePayment(paymentId: number, status: Status, statusMessage?: string){
    return await prisma.$transaction(async (tx)=> {
        const payment = await tx.payment.findUnique({where: {id: paymentId}});

        if (!payment) {
            throw new RequestError("NotFound", "Payment not found");
        }
        if (status === "APPROVED"){
            await tx.user.update({
                data: {
                    balance: {decrement: payment.amount} 
                },
                where:{
                    id: payment.senderId
                }
            })
            await tx.user.update({
                data: {
                    balance: {increment: payment.amount} 
                },
                where:{
                    id: payment.recipientId
                }
            })
        }

        return await tx.payment.update({
            where: {id: payment.id},
            data: {
                status,
                statusMessage
            }
        })
    })
}


export async function getIdempotencyKey(idemK: string) {
    return await prisma.idempotencyKey.findUnique({where: {id: idemK}});
}

export async function getUserPayments(senderId: number){
    return await prisma.payment.findMany({where: {senderId}})
}