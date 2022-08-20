import {
  register,
  verifyEmail,
  login,
  logout,
  forgetPassword,
  resetPassword,
} from "../controller/authController";
import express, { Router } from "express";

const router: Router = express.Router();
router.post("/register", register);
router.post("/verify-email", verifyEmail);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forget-password", forgetPassword);
router.post("/reset-password", resetPassword);

export default router;
