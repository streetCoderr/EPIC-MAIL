import crypto from "crypto";
import Token from "../model/token";
import { Response, NextFunction } from 'express'
import {UnauthenticatedError} from "../error";
import {generatePayload, addCookiesToResponse} from "../utils";
import asyncErrorCatcher from "./asyncErrorCatcher";
import { Req } from "../interface";

const authenticateUser = asyncErrorCatcher(async (req: Req, res: Response, next: NextFunction) => {
  try {
    const { accessToken, refreshToken }: any = req.signedCookies
    if (accessToken) {
      const payload = generatePayload(accessToken)
      req.user = payload
      return next()
    }
    const payload = generatePayload(refreshToken)
    const tokenExists = await Token.findOne({
      refreshToken: payload.refreshToken,
      user: payload.user
    })
    if (!tokenExists || !tokenExists.isValid)
      throw new UnauthenticatedError("Authentication failed")

    const newRefreshToken = crypto.randomBytes(40).toString("hex");
    tokenExists.refreshToken = newRefreshToken
    await tokenExists.save()
    addCookiesToResponse({res, user: payload.user, refreshToken: newRefreshToken})
    req.user = payload.user
    next()
  } catch (error) {
    throw new UnauthenticatedError("Authentication failed")
  }
})

export default authenticateUser