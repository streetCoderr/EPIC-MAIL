require('dotenv').config();
const crypto = require("crypto")
const Token = require("../model/token")
const {UnauthenticatedError} = require("../error")
const {generatePayload, addCookiesToResponse} = require("../utils")

const authenticateUser = (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.signedCookies
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
      throw new UnauthenticatedError("Authentication failed.")

    const newRefreshToken = crypto.randomBytes(40).toString("hex");
    tokenExists.refreshToken = newRefreshToken
    await tokenExists.save()
    addCookiesToResponse({res, user: payload.user, refreshToken: newRefreshToken})
    req.user = payload.user
    next()
  } catch (error) {
    throw new UnauthenticatedError("Authentication failed")
  }
}

module.exports = authenticateUser