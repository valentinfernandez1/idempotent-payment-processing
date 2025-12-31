import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import { config } from "../config";
import { PrismaClientKnownRequestError } from "../generated/prisma/internal/prismaNamespace";

const adapter = new PrismaPg({ connectionString: config.db.sqlUrl })
const prisma = new PrismaClient({ adapter })

export { prisma }

export async function initPrisma() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Postgres Database connected");
  } catch (err: PrismaClientKnownRequestError | unknown) {
    err instanceof PrismaClientKnownRequestError
        ? console.error(`Database connection failed: ${err.name} - ${err.code} \nError message: ${err.message}`)
        : console.log(`Database connection failed: `, err)
    
    process.exit(1); 
  }
}