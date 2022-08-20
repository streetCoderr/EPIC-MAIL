import jwt from "jsonwebtoken";
import { jwtSecret } from "../config";

export const generateToken = (payload: any) => jwt.sign(payload, jwtSecret);

export const generatePayload: any = (token: string) =>
  jwt.verify(token, jwtSecret);

export const addCookiesToResponse = ({ res, user, refreshToken }: any) => {
  const accessTokenJWT = generateToken(user);
  const refreshTokenJWT = generateToken({ user, refreshToken });
  const oneDay = 1000 * 60 * 60 * 24;
  const thirtyDays = 1000 * 60 * 60 * 24 * 30;

  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    maxAge: oneDay,
    signed: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    maxAge: thirtyDays,
    signed: true,
    secure: process.env.NODE_ENV === "production",
  });
};
