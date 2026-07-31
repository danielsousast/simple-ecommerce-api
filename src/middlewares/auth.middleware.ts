import { NextFunction, Request, Response } from "express";
import { TokenPayload, verifyToken } from "../helpers/jwt.js";

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Requires a valid JWT in the Authorization header using the Bearer scheme.
 * The verified token claims are available to following handlers as req.user.
 */
function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    res.status(401).json({ error: req.t("accessTokenRequired") });
    return;
  }

  const token = authorization.slice("Bearer ".length).trim();
  const payload = token ? verifyToken(token) : null;

  if (!payload) {
    res.status(401).json({ error: req.t("invalidOrExpiredToken") });
    return;
  }

  req.user = payload;
  next();
}

export default authenticate;
