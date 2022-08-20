import nodemailer from "nodemailer";
import { google } from "googleapis";
import {
  googleClientId,
  googleClientSecret,
  googleRefreshToken,
} from "../config";

const redirectURL = "https://developers.google.com/oauthplayground";
const oAuth2Client = new google.auth.OAuth2(
  googleClientId,
  googleClientSecret,
  redirectURL
);
oAuth2Client.setCredentials({ refresh_token: googleRefreshToken });

export default async function sendMail ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const accessToken = await oAuth2Client.getAccessToken();
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: "streetcoder99@gmail.com",
        clientId: googleClientId,
        clientSecret: googleClientSecret,
        refreshToken: googleRefreshToken,
        accessToken: accessToken.token ?? ''
      },
    });

    return transporter.sendMail({
      from: '"Epic-Mail" <steve@epicmail.com>',
      to,
      subject,
      html,
    });
  } catch (error) {
    console.log(error);
  }
};
