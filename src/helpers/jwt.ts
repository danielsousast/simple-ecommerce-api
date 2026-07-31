import jwt from "jsonwebtoken";
import "dotenv/config";
import { IUser } from "../models/user.model.js";

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

export interface TokenPayload {
  id: string;
  email: string;
  role: "user" | "admin";
  iat?: number;
  exp?: number;
}

export function generateToken(user: IUser): string {
  return jwt.sign({
    id: user._id,
    email: user.email,
    role: user.role,
  }, SECRET_KEY, { expiresIn: "24h" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    const payload = jwt.verify(token, SECRET_KEY);

    if (
      typeof payload === "string" ||
      typeof payload.id !== "string" ||
      typeof payload.email !== "string" ||
      (payload.role !== "user" && payload.role !== "admin")
    ) {
      return null;
    }

    return payload as TokenPayload;
  } catch (error) {
    return null;
  }
}
