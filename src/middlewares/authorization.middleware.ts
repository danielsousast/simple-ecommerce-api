import { NextFunction, Request, Response } from "express";
import { TokenPayload } from "../helpers/jwt.js";

type Role = TokenPayload["role"];

/**
 * Allows access only when the authenticated user has one of the given roles.
 * Use this after the authenticate middleware.
 */
function authorize(...allowedRoles: Role[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.auth) {
      res.status(401).json({ error: req.t("authenticationRequired") });
      return;
    }

    if (!allowedRoles.includes(req.auth.role)) {
      res.status(403).json({ error: req.t("insufficientPermissions") });
      return;
    }

    next();
  };
}

export default authorize;
