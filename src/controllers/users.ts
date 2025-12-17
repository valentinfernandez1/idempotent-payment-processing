import { Request, Response } from "express";
import { RequestError } from "../utils/errors";
import { hash } from "../utils/utils";
import { createUser, getUserByEmail } from "../db/queries/users";
import { CreateUserDTO, EmailParam } from "../schemas/user.schema";
import { extractJWT, JwtPayload } from "../utils/auth/auth";

export async function handleGetUserByEmail(req: Request<EmailParam>, res: Response) {
    const jwtPayload: JwtPayload = extractJWT(req)
    const user = await getUserByEmail(req.params.email);
    
    if (!user) throw new RequestError("NotFound", "User not found");
    if(user.id !== Number(jwtPayload.sub)) throw new RequestError("Forbidden", `Not allowed to access user information`);

    res.status(200).json(user);
}

export async function handleUserCreation(req: Request<{}, any, CreateUserDTO>, res: Response) {
    const {email, name, password} = req.body;
    
    if (await getUserByEmail(email)) throw new RequestError("Conflict", "Email already in use");
    
    const hashedPassword = await hash(password);

    const user = await createUser({email: email, password: hashedPassword, name: name});

    res.status(201).json({ message: "User created successfully", user });
}
