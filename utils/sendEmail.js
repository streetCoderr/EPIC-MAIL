require("dotenv").config()
const nodemailer = require('nodemailer');
const { google } = require("googleapis")

const redirectURL = 'https://developers.google.com/oauthplayground'
const oAuth2Client = new google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, redirectURL)
oAuth2Client.setCredentials({refresh_token: process.env.REFRESH_TOKEN})

const sendMail = async ({to, subject, html}) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'ivuelekwas@gmail.com',
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: await oAuth2Client.getAccessToken()
      }
    });
  
    return transporter.sendMail({
      from: '"Epic-Mail" <steve@epicmail.com>',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.log(error)
  }
}

module.exports = sendMail