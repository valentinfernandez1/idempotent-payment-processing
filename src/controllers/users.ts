import { Request, Response } from "express";
import { RequestError } from "../utils/errors";
import { hash } from "../utils/utils";
import { prisma } from "../db/prisma";
import validator from 'validator';
import { createUser, getUserByEmail } from "../db/queries/users";

export async function handleGetUserByEmail(req: Request, res: Response) {
    const email = req.params.email;

    if (!validator.isEmail) throw new RequestError("BadRequest", "Invalid email format");
    
    const user = await getUserByEmail(email);

    if (!user) throw new RequestError("NotFound", "User not found");

    res.status(200).json(user);
}

export async function handleUserCreation(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
        name: string;
    };
    const params: parameters = req.body;
    if (!params.email || !params.password || !params.name) throw new RequestError("BadRequest", "Missing required fields");

    if (!validator.isEmail(params.email)) throw new RequestError("BadRequest", "Invalid email format");
    if (await getUserByEmail(params.email)) throw new RequestError("Conflict", "Email already in use");

    const hashedPassword = await hash(params.password);

    const user = await createUser({email: params.email, password: hashedPassword, name: params.name});

    res.status(201).json({ message: "User created successfully", user });
}