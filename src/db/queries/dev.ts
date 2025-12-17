import { prisma } from "../prisma";
import { DefaultUserOmits } from "./users";

export async function grantBalance(id: number, balance: number){
    return await prisma.user.update({
        data: {
            balance
        },
        where: {id},
        omit: DefaultUserOmits
    });
}