import { envOrThrow } from "./index.js"
process.loadEnvFile();

const PLATFORMS = ['DEV', 'TESTING', 'PRODUCTION' ] as const;
type Platform = typeof PLATFORMS[number];

function disernPlatform(platform: string): Platform {
  if (!PLATFORMS.includes(platform as Platform)){
     throw new Error(`Environment Variable PLATFORM: ${platform} is incorrect. Available options [ ${PLATFORMS.map((p) => `"${p}"`).join(' | ')} ]`);
  }
  return platform as Platform
}

export type ApiConfig = {
    platform: Platform
    port: number
}   

export const apiConfig: ApiConfig = {
    platform: disernPlatform(envOrThrow("PLATFORM")),
    port: parseInt(envOrThrow("API_PORT")),
}