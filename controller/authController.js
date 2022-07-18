const User = require("../model/user");
const Token = require("../model/token");

const { BadRequestError, NotFoundError, UnauthenticatedError } = require("../error");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const { sendVerificationMail, generateTokenUser, addCookiesToResponse } = require("../utils");

const register = async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;
  const user = await User.create({
    firstName,
    lastName,
    userName,
    email,
    password,
  });
  user.verificationToken = crypto.randomBytes(50).toString("hex");
  await user.save();
  // temporary origin
  const origin = "http://localhost:3000";
  sendVerificationMail({
    email,
    origin,
    name: firstName,
    verificationToken: user.verificationToken,
  });
  res
    .status(StatusCodes.CREATED)
    .json({
      msg: "Your account was created successfully. Check your email to verify your account",
    });
};

const verifyEmail = async (req, res) => {
  // In production, the token and email will be provided by the frontend
  const { token, email } = req.query
  const user = await User.findOne({email, verificationToken: token})
  if (!user) {
    throw new UnauthenticatedError("Verication failed!")
  }
  if (user.isVerified) {
    throw new BadRequestError("This account have previously been verified. Proceed to login")
  }
  user.verificationToken = ""
  user.isVerified = true
  user.verificationDate = new Date()

  await user.save()
  res.status(StatusCodes.OK).json({msg: "Verification successful"})
};

const login = async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    throw new BadRequestError("please provide email and password")
  }
  const user = await User.findOne({email: email.toLowerCase()})
  if (!user || !(await user.comparePassword(password))) {
    throw new UnauthenticatedError("Authentication failed. Invalid credentials")
  }
  if (!user.isVerified) {
    throw new UnauthenticatedError("Please verify your mail")
  }

  let refreshToken;
  const tokenizedUser = generateTokenUser(user)
  const existingToken = await Token.findOne({user: user._id})
  if (existingToken) {
    if (!existingToken.isValid) {
      throw new UnauthenticatedError("Access denied. Please contact support")
    }
    refreshToken = existingToken.refreshToken
    addCookiesToResponse({res, user: tokenizedUser, refreshToken})
    return res.status(StatusCodes.OK).json({user: tokenizedUser})
  }

  refreshToken = crypto.randomBytes(40).toString('hex');
  await Token.create({refreshToken, isValid: true, user: user._id})
  addCookiesToResponse({res, user: tokenizedUser, refreshToken})
  res.status(StatusCodes.OK).json({user: tokenizedUser})
};

const logout = async (req, res) => {
  res.send("logout");
};

const forgetPassword = async (req, res) => {
  res.send("forgetPassword");
};

const resetPassword = async (req, res) => {
  res.send("resetPassword");
};

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  forgetPassword,
  resetPassword,
};
