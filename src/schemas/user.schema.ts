import * as z from "zod";

export const CreateUserSchema = z.object({
    email: z.email().max(255),
    password: z.string().min(1),
    name: z.string().min(1).max(50),
});

export type CreateUserDTO = z.infer<typeof CreateUserSchema>;

export const EmailParamSchema = z.object({
    email: z.email().max(255),
});
export type EmailParam = z.infer<typeof EmailParamSchema>;