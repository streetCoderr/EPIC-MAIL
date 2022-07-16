const User = require("../model/user");
const { BadRequestError, NotFoundError, UnauthenticatedError } = require("../error");
const { StatusCodes } = require("http-status-codes");
const crypto = require("crypto");
const { sendVerificationMail } = require("../utils");

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
  const user = await User.find({email, verificationToken: token})
  if (!user) {
    throw new UnauthenticatedError("Verication failed!")
  }
  user.verificationToken = ""
  user.isVerified = true
  user.verificationDate = new Date()

  await user.save()
  res.status(StatusCodes.OK).json({msg: "Verification successful"})
};

const login = async (req, res) => {
  res.send("login");
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
