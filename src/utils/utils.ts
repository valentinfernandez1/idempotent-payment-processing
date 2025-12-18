import argon2 from "argon2";
import { config } from "../config/index.js";
import { Request } from "express";
import { RequestError } from "./errors.js";
import { z } from "zod";


export function loggerFormat(){
    return config.api.platform == "PRODUCTION"? "common" : "dev";  
}

export async function hash(text: string) {
  return argon2.hash(text);
}

export async function verifyHash(password: string, hash: string) {
  return argon2.verify(hash, password);
}

const idempotencyKeySchema = z.string().min(16).max(128);
export function getIdempotencyHeader(req: Request): string {
  const idempotencyKey =  req.get("Idempotency-Key");

  if (!idempotencyKey) throw new RequestError("BadRequest", "Idempotency-Key header is missing");

  const parsed = idempotencyKeySchema.safeParse(idempotencyKey);

  if (!parsed.success) throw new RequestError("BadRequest","Invalid Idempotency-Key format");
  
  return parsed.data
}

