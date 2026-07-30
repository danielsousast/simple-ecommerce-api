import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

function validateRequest(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      error: req.t("validationFailed"),
      details: errors.array({ onlyFirstError: true }).map((validationError) => ({
        field: "path" in validationError ? validationError.path : "request",
        message: validationError.msg,
      })),
    });
    return;
  }

  next();
}

export default validateRequest;
