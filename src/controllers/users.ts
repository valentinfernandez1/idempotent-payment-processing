import { Request, Response } from "express";
import { RequestError } from "../utils/errors";
import { hash } from "../utils/utils";
import { prisma } from "../db/prisma";


export async function handleUserCreation(req: Request, res: Response) {
    type parameters = {
        email: string;
        password: string;
        name: string;
    };
    const params: parameters = req.body;
    if (!params.email || !params.password || !params.name) {
        throw new RequestError("BadRequest", "Missing required fields");
    }

    const hashedPassword = await hash(params.password);

    const user = await prisma.user.create({
        data: {
            email: params.email,
            password: hashedPassword,
            name: params.name,
        },
        omit: {
            password: true,
        }
    });


    res.status(201).json({ message: "User created successfully", user });
}