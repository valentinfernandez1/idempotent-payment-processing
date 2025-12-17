// middlewares/validate.ts
import { ZodType } from "zod";
import * as z from "zod";
import { Request, Response, NextFunction } from "express";

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