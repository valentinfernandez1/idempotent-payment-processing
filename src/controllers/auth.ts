import { Request, Response } from "express";
import { LoginDTO } from "../schemas/auth.schema";
import { getUserByEmail } from "../db/queries/users";
import { RequestError } from "../utils/errors";
import { hash, verifyHash } from "../utils/utils";
import { createJWT } from "../utils/auth/auth";

export async function handleUserLogin(req: Request<{}, any, LoginDTO>, res: Response) {
    const {email, password} = req.body;

    const user = await getUserByEmail(email, {omitPassword: false, omitRole: false});

    if(!user) throw new RequestError("NotFound", `User not found`);
    if(!(await verifyHash(password, user.password!))) throw new RequestError("Unauthorized", "Incorrect Password");

    const token = createJWT(user.id.toString(), user.role.name)
    const responseBody = {
        balance: user.balance,
        createdAt: user.createdAt,
        email: user.email, 
        id: user.id,
        name: user.name,
        role: user.role.name,
        token,
        updatedAt: user.updatedAt
    }
    res.status(200).json(responseBody)
}