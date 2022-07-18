const sendVerificationMail = require("./sendVerificationMail")
const generateTokenUser = require('./generateTokenUser')
const {
  generateToken,
  generateUser,
  addCookiesToResponse
} = require('./tokenUtils')
module.exports = {
  sendVerificationMail,
  generateTokenUser,
  generateToken,
  generateUser,
  addCookiesToResponse
}