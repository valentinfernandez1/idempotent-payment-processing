import { envOrThrow } from "./index.js"
process.loadEnvFile();

export type StorageConfig = {
    redisUrl: string
    sqlUrl: string
}

export const dbConfig: StorageConfig = {
    redisUrl: envOrThrow("REDIS_URL"),
    sqlUrl: envOrThrow("DATABASE_URL")
}
