import { Request, Response } from "express";
import { apiConfig } from "../config/api";
import { deleteAllData } from "../db/queries/admin";
import { GrantDTO } from "../schemas/admin.schema";
import { getUserByEmail } from "../db/queries/users";
import { RequestError } from "../utils/errors";
import { grantBalance } from "../db/queries/dev";

const checkDevEnv = () => {
    if (apiConfig.platform !== 'DEV') throw new RequestError("Forbidden","Reset is only allowed in DEV platform");    
}

export async function handleReset(req: Request, res: Response) {
    checkDevEnv();

    await deleteAllData();

    res.status(200).json({ message: "Reset successful" });
}

export async function handleGrantFreeBalance(req: Request<{}, any, GrantDTO>, res: Response){
    const { balance, email } = req.body;

    const user = await getUserByEmail(email)
    if(!user) throw new RequestError("NotFound", `User not found`);

    const updatedUser = await grantBalance(user.id, balance);

    res.status(200).json(updatedUser);
}
