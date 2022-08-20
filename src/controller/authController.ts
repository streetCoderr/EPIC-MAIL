import User from "../model/user";
import Token from "../model/token";
import { Request, Response } from "express"
import { Req } from "../interface";
import bcrypt from "bcryptjs";

import asyncErrorCatcher from '../middleware/asyncErrorCatcher'
import {
  BadRequestError,
  UnauthenticatedError,
} from "../error";

import { StatusCodes } from "http-status-codes";
import crypto from "crypto";

import {
  sendVerificationMail,
  generateTokenUser,
  addCookiesToResponse,
  sendResetPasswordMail,
} from "../utils";

export const register = asyncErrorCatcher(async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
  });
  user.verificationToken = crypto.randomBytes(50).toString("hex");
  await user.save();
  
  const origin = `${req.protocol}://${req.get('host')}`;
  sendVerificationMail({
    email,
    origin,
    name: firstName,
    verificationToken: user.verificationToken,
  });

  res.status(StatusCodes.CREATED).json({
    msg: "Your account was created successfully. Check your email to verify your account",
  });
})

export const verifyEmail = asyncErrorCatcher(async (req: Request, res: Response) => {
  const { token, email } = req.body;
  const user = await User.findOne({ email, verificationToken: token });

  if (!user) {
    throw new UnauthenticatedError("Verication failed!");
  }
  if (user.isVerified) {
    throw new BadRequestError(
      "This account have previously been verified. Proceed to login"
    );
  }

  user.verificationToken = "";
  user.isVerified = true;
  user.verificationDate = new Date();

  await user.save();
  res.status(StatusCodes.OK).json({ msg: "Verification successful" });
})

export const login = asyncErrorCatcher(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("please provide email and password");
  }

  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw new UnauthenticatedError(
      "Authentication failed. Invalid credentials"
    );
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError(
      "Authentication failed. Invalid credentials"
    );
  }

  if (!user.isVerified) {
    throw new UnauthenticatedError("Please verify your mail");
  }

  let refreshToken;
  const tokenizedUser = generateTokenUser(user);
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    if (!existingToken.isValid) {
      throw new UnauthenticatedError("Access denied. Please contact support");
    }
    refreshToken = existingToken.refreshToken;
    addCookiesToResponse({ res, user: tokenizedUser, refreshToken });
    return res.status(StatusCodes.OK).json({ user: tokenizedUser });
  }

  refreshToken = crypto.randomBytes(40).toString("hex");
  await Token.create({ refreshToken, user: user._id });
  addCookiesToResponse({ res, user: tokenizedUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenizedUser });
})

export const logout = asyncErrorCatcher(async (req: Req, res: Response) => {

  const userId = req.user.userId
  if (userId) {
    await Token.findOneAndDelete({user: userId})
  }

  res.cookie("accessToken", "", {
    maxAge: 0,
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.cookie("refreshToken", "", {
    maxAge: 0,
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(StatusCodes.OK).json({ msg: "Logged out successfully" });
})

export const forgetPassword = asyncErrorCatcher(async (req: Request, res: Response) => {
  let { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide your email address");
  }
  email = email.toLowerCase();

  const user = await User.findOne({ email });
  if (user) {
    
    const origin = `${req.protocol}://${req.get('host')}`;
    const passwordToken = crypto.randomBytes(50).toString("hex");

    sendResetPasswordMail({
      email,
      origin,
      passwordToken,
      name: user.firstName,
    });

    const oneHour = 1000 * 60 * 60;
    user.passwordToken = passwordToken;
    user.passwordTokenExpirationDate = new Date(Date.now() + oneHour);
    await user.save();
  }
  res.status(StatusCodes.OK).json({
    msg: `A link has been sent to ${email}. Follow it to reset your password.`,
  });
})

export const resetPassword = asyncErrorCatcher(async (req: Request, res: Response) => {
  const { password, token, email } = req.body;
  if (!token || !email || !password) {
    throw new BadRequestError(
      "Please provide the following values: token, email and password"
    );
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (user) {
    const currentDate = new Date();
    if (
      user.passwordToken === token && user.passwordTokenExpirationDate &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = undefined;
      user.passwordTokenExpirationDate = undefined;
      await user.save();
    }
  }
  
  res
    .status(StatusCodes.OK)
    .json({ msg: "Your password has been reset successfully" });
})
