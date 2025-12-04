import { envOrThrow } from "./index.js"
process.loadEnvFile();

export type ApiConfig = {
    port: number
}   

export const apiConfig: ApiConfig = {
    port: parseInt(envOrThrow("API_PORT")),
}