// middlewares/validate.ts
import { ZodType } from "zod";
import * as z from "zod";
import { Request, Response, NextFunction } from "express";
import { RequestError } from "../utils/errors";
import { verifyJWT } from "../utils/auth/auth";
import { getIdempotencyHeader } from "../utils/utils";
import { getIdempotencyKey } from "../db/queries/payment";
import { getRedis } from "../db/redis";

export const validateBody =
  (schema: ZodType) =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        errors: z.treeifyError(result.error),
      });
    }

    req.body = result.data; 
    next();
};

export const validateParams = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.params);

    if (!result.success) {
      return res.status(400).json({
        errors: z.treeifyError(result.error),
      });
    }   

    req.params = result.data as any;
    next();
}

const AUTHORIZATION_HEADER = "Authorization";
export function extractJWTMiddleware(
  req: Request,
  _res: Response,
  next: NextFunction
){
    let token = req.get(AUTHORIZATION_HEADER);
    if(!token) throw new RequestError("Unauthorized", "[Authorization] header not found on the request");

    token = token.slice("Bearer ".length);

    req.auth = verifyJWT(token);

    next();
}

const IDEMPOTENCY_KEY_PREFIX = "idemK:"
export async function idempotencyMiddleware(req: Request, res: Response, next: NextFunction){
  const idempoKey = getIdempotencyHeader(req);
  req.idempotencyKey = idempoKey;

  const redis = getRedis();
  const redisKey = `${IDEMPOTENCY_KEY_PREFIX}${idempoKey}`

  const lockAcquired  = await redis.set(
    redisKey, 
    "IN_PROGRESS", 
    {
      condition: "NX", 
      expiration: {
        type: "EX", 
        value: 600
    }});

  if (!lockAcquired){
    const cachedResponse = await redis.get(redisKey);

    if (cachedResponse && cachedResponse !== 'IN_PROGRESS'){
      return res.status(200).json(JSON.parse(cachedResponse));
    }

    throw new RequestError("Conflict", "Duplicated Request in progress")
  }

  if (await getIdempotencyKey(idempoKey)) {
    await redis.del(redisKey);
    throw new RequestError(
      "UnprocessableEntity",
      "Duplicate request"
    );
  }
  
  res.on("finish", async () => {
    if (res.statusCode >= 200 && res.statusCode < 500) {
      await redis.set(
        redisKey,
        JSON.stringify(res.locals.idempotentResponse) ,
        { EX: 600 }
      );
    }
  });
  
  next()
}

