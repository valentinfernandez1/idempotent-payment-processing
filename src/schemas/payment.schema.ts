import * as z from "zod";

export const PaymentSchema = z.object({
    amount: z.number().positive(),
    recipient: z.coerce.number().positive()
});

export type PaymentDTO = z.infer<typeof PaymentSchema>;

export const FundSchema = z.object({
    amount: z.number().positive()
});

export type FundDTO = z.infer<typeof FundSchema>;