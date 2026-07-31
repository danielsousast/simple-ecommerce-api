import jwt from "jsonwebtoken";
import "dotenv/config";
import { IUser } from "../models/user.model.js";

const SECRET_KEY = process.env.SECRET_KEY || "default_secret_key";

export function generateToken(user: IUser): string {
  return jwt.sign({
    id: user._id,
    email: user.email,
    role: user.role,
  }, SECRET_KEY, { expiresIn: "24h" });
}

export function verifyToken(token: string): object | null {
  try {
    return jwt.verify(token, SECRET_KEY) as object;
  } catch (error) {
    return null;
  }
}
