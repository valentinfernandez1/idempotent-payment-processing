import { NextFunction, Request, Response } from "express";

const RequestErrorInfo = {
    BadRequest: {status: 400, message: "Bad Request"},
    Unauthorized: {status: 401, message: "Unauthorized"},
    Forbidden: {status: 403, message: "Forbidden"},
    NotFound: {status: 404, message: "Not Found"},
} as const;

type RequestErrors = keyof typeof RequestErrorInfo;

export class RequestError extends Error {
    code: number;
    constructor(requestError: RequestErrors, message?: string) {
        super(message || RequestErrorInfo[requestError].message);
        this.code = RequestErrorInfo[requestError].status;
    }
}

export function errorHandlerMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof RequestError) {
        return res.status(err.code).json({ error: err.message });
    }
    res.status(500).json({ error: err.message || "Something went wrong on our end" });
}