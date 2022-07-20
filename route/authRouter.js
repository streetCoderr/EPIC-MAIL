const {
  register,
  verifyEmail,
  login,
  logout,
  forgetPassword,
  resetPassword,
} = require("../controller/authController");
const express = require("express");
const router = express.Router();
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
