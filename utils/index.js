const sendVerificationMail = require("./sendVerificationMail");
const sendResetPasswordMail = require("./sendResetPasswordMail");
const generateTokenUser = require("./generateTokenUser");
const {
  generateToken,
  generatePayload,
  addCookiesToResponse,
} = require("./tokenUtils");
module.exports = {
  sendVerificationMail,
  generateTokenUser,
  generateToken,
  generatePayload,
  addCookiesToResponse,
  sendResetPasswordMail,
};
