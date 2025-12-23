import { JwtPayload } from "../utils/auth/auth";

declare global {
  namespace Express {
    interface Request {
      auth?: JwtPayload;
      idempotencyKey: string
    }
  }
}