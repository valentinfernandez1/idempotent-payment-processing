import * as z from "zod";

export const LoginSchema = z.object({
    email: z.email().max(255),
    password: z.string().min(1),
});

export type LoginDTO = z.infer<typeof LoginSchema>;