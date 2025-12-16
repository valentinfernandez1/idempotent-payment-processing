import { Request, Response } from "express";
import { RequestError } from "../utils/errors";
import { hash } from "../utils/utils";
import validator from 'validator';
import { createUser, getUserByEmail } from "../db/queries/users";
import { CreateUserDTO, EmailParam } from "../schemas/user.schema";

export async function handleGetUserByEmail(req: Request<EmailParam>, res: Response) {
    const user = await getUserByEmail(req.params.email);

    if (!user) throw new RequestError("NotFound", "User not found");

    res.status(200).json(user);
}

export async function handleUserCreation(req: Request<{}, any, CreateUserDTO>, res: Response) {
    const params = req.body;
    
    if (await getUserByEmail(params.email)) throw new RequestError("Conflict", "Email already in use");

    const hashedPassword = await hash(params.password);

    const user = await createUser({email: params.email, password: hashedPassword, name: params.name});

    res.status(201).json({ message: "User created successfully", user });
}