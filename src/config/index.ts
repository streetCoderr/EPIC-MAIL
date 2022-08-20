import { Secret } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const jwtSecret: Secret = process.env.JWT_SECRET_KEY || "mysecret";
export const mongoURI: string = process.env.MONGO_URI || "mongoURI";
export const googleClientId = process.env.CLIENT_ID || "googleCLientId";
export const googleClientSecret =
  process.env.CLIENT_SECRET || "googleCLientSecret";
export const googleRefreshToken =
  process.env.REFRESH_TOKEN || "googleRefreshToken";
