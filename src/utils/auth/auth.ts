import jwt from 'jsonwebtoken';
import { apiConfig } from '../../config/api';
import { RequestError } from '../errors';
import { decode } from 'punycode';
import { Request } from 'express';

export type JwtPayload = Pick<jwt.JwtPayload, 'iat' | 'exp' | 'iss' | 'sub'> & { role: string }
const iss = 'idempotent-payment-processing';

// Default jwt expiration is 15 minutes
const DEFAULT_JWT_EXPIRATION = 900


export function createJWT (userId: string, role: 'ADMIN' | 'USER' = 'USER', expiresIn = DEFAULT_JWT_EXPIRATION ): string {
    const iat = Math.floor(Date.now() / 1000)
    const payload: JwtPayload = {
        iss,
        sub: userId,
        iat,
        exp: iat + expiresIn,
        role
    }
    return jwt.sign(payload, apiConfig.jwtSecret, { algorithm: 'HS256' });
}

export function verifyJWT (token: string): JwtPayload {
    try {
        const decoded = jwt.verify(token, apiConfig.jwtSecret) as JwtPayload;
        if (decoded.iss !== iss) throw new RequestError("Unauthorized",'Invalid token issuer');
        if (decoded.sub === undefined) throw new RequestError("Unauthorized",'Token subject missing');
        if (decoded.role === undefined) throw new RequestError("Unauthorized",'Token role missing');
        
        return decoded;
    } catch (error) {
        throw new RequestError("Unauthorized",'Invalid token');
    }
}

const AUTHORIZATION_HEADER = "Authorization";
export function extractJWT(req: Request): JwtPayload {
    let token = req.get(AUTHORIZATION_HEADER);
    if(!token) throw new RequestError("Unauthorized", "[Authorization] header not found on the request");

    token = token.replace('Bearer ', '');

    return verifyJWT(token)
}
