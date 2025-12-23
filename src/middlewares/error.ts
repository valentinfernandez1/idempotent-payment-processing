import { NextFunction, Request, Response } from "express";
import { RequestError } from "../utils/errors";

export function errorHandlerMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof RequestError) {
        return res.status(err.code).json({ error: err.message });
    }

    res.status(500).json({ error: err.message || "Something went wrong on our end" });
}