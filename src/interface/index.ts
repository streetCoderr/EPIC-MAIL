import { Types } from "mongoose";
import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface ITokenUser {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export interface IUser {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
  verificationToken?: string;
  isVerified?: boolean;
  verificationDate?: Date;
  passwordToken?: string;
  passwordTokenExpirationDate?: Date;
}

export interface Req extends Request {
  user?: any;
}
