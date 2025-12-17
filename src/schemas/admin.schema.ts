import * as z from "zod";

export const GrantSchema = z.object({
    email: z.email().max(255),
    balance: z.number().positive(),
});

export type GrantDTO = z.infer<typeof GrantSchema>;