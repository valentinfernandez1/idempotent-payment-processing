import { NextFunction, Request, Response } from "express";

const RequestErrorInfo = {
    BadRequest: {status: 400, message: "Bad Request"},
    Unauthorized: {status: 401, message: "Unauthorized"},
    Forbidden: {status: 403, message: "Forbidden"},
    NotFound: {status: 404, message: "Not Found"},
    Conflict: {status: 409, message: "Conflict"},
    UnprocessableEntity: {status: 422, message: "Unprocessable Entity"},
} as const;

type RequestErrors = keyof typeof RequestErrorInfo;

export class RequestError extends Error {
    code: number;
    constructor(requestError: RequestErrors, message?: string) {
        super(message || RequestErrorInfo[requestError].message);
        this.code = RequestErrorInfo[requestError].status;
    }
}