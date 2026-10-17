import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });
      next();
    } catch (error: any) {
      const issues = error.issues || error.errors || [];
      const errorDetails = issues.map((err: any) => ({
        field: err.path.join("."),
        message: err.message,
        code: err.code,
      })) || [];
      
      // Debug log for login validation failures
      if (req.path.includes('login')) {
      }
      
      const firstMessage = errorDetails.length > 0 ? errorDetails[0].message : "Validation failed";
      console.log(`[Validation Error] ${req.method} ${req.path}`, { body: req.body, errors: errorDetails });
      
      return res.status(400).json({
        success: false,
        message: firstMessage,
        errors: errorDetails,
      });
    }
  };
