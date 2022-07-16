const User = require("../model/user")

const register = async (req, res) => {
  res.send("register")
}

const verifyEmail = async (req, res) => {
  res.send("verify email")
}

const login = async (req, res) => {
  res.send("login")
}

const logout = async (req, res) => {
  res.send("logout")
}

const forgetPassword = async (req, res) => {
  res.send("forgetPassword")
}

const resetPassword = async (req, res) => {
  res.send("resetPassword")
}

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  forgetPassword,
  resetPassword
}