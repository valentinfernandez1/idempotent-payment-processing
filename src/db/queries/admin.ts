import { prisma } from "../prisma";

export async function deleteAllData(){
    await prisma.user.deleteMany({
        where: {
            roleId: 2
        }
    });
    await prisma.payment.deleteMany();

    return 
}