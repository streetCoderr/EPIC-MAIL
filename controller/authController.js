const User = require("../model/user");
const Token = require("../model/token");

const {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} = require("../error");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const {
  sendVerificationMail,
  generateTokenUser,
  addCookiesToResponse,
  sendResetPasswordMail,
} = require("../utils");

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
  // The origin should be changed to the clientside domain
  const origin = "http://localhost:3000";
  sendVerificationMail({
    email,
    origin,
    name: firstName,
    verificationToken: user.verificationToken,
  });
  res.status(StatusCodes.CREATED).json({
    msg: "Your account was created successfully. Check your email to verify your account",
  });
};

const verifyEmail = async (req, res) => {
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
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new BadRequestError("please provide email and password");
  }
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user || !(await user.comparePassword(password))) {
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
  await Token.create({ refreshToken, isValid: true, user: user._id });
  addCookiesToResponse({ res, user: tokenizedUser, refreshToken });
  res.status(StatusCodes.OK).json({ user: tokenizedUser });
};

const logout = async (req, res) => {
  res.cookie("accessToken", "nothing", {
    maxAge: 0,
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  res.cookie("refreshToken", "nothing", {
    maxAge: 0,
    signed: true,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(StatusCodes.OK).json({ msg: "Logged out successfully" });
};

const forgetPassword = async (req, res) => {
  let { email } = req.body;
  if (!email) {
    throw new BadRequestError("Please provide your email address");
  }
  email = email.toLowerCase();
  const user = await User.findOne({ email });
  if (user) {
    // temporary origin
    // The origin should be changed to the clientside domain
    const origin = `http://localhost:3000`;
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
};

const resetPassword = async (req, res) => {
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
      user.passwordToken === token &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: "Your password has been reset successfully" });
};

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  forgetPassword,
  resetPassword,
};
