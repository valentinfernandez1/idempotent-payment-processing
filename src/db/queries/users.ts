import { PrismaClientValidationError } from '@prisma/client/runtime/client.js';
import { PrismaClientKnownRequestError } from '../../generated/prisma/internal/prismaNamespace.js';
import { UserCreateInput } from '../../generated/prisma/models/User.js';
import { prisma } from '../prisma';

export const DefaultUserOmits = {password: true, roleId: true}

export async function getUserByEmail(email: string, options?: {omitPassword: boolean, omitRole: boolean}) {
    return await prisma.user.findUnique({
        where: {
            email: email,
        },  
        omit: options? {
            password: options.omitPassword,
            roleId: options.omitPassword,
        } : DefaultUserOmits,
        include: {role: !(options? options.omitPassword : DefaultUserOmits.roleId)}
    });
}

export async function createUser(user: UserCreateInput) {
    try {
        return await prisma.user.create({
            data: {
                email: user.email,
                password: user.password,
                name: user.name,
            },
            omit: DefaultUserOmits
        });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            throw new Error('Email already in use');
        }
        if (error instanceof PrismaClientValidationError) {
            throw new Error('Invalid user data');
        }

        throw error;
    }
}

