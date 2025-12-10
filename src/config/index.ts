import { apiConfig, ApiConfig } from "./api.js";

export function envOrThrow(key: string) {
    const val = process.env[key];
    if (!val) {
        throw new Error(`Environment variable ${key} is not set`);
    }
    return val;
}

type Config = {
    api: ApiConfig
}

export const config: Config = {
    api: apiConfig,
}


