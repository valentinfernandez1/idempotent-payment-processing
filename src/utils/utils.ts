import argon2 from "argon2";
import { config } from "../config/index.js";

export function loggerFormat(){
    return config.api.platform == "PRODUCTION"? "common" : "dev";  
}

export async function hash(text: string) {
  return argon2.hash(text);
}

export async function verifyHash(password: string, hash: string) {
  return argon2.verify(hash, password);
}