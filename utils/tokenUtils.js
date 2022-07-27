require("dotenv").config();
const jwt = require("jsonwebtoken");

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET_KEY);

const generatePayload = (token) => jwt.verify(token, process.env.JWT_SECRET_KEY);

const addCookiesToResponse = ({ res, user, refreshToken }) => {
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

module.exports = {
  generateToken,
  generatePayload,
  addCookiesToResponse,
};
