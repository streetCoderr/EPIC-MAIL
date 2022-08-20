import sendMail from "./sendEmail";

interface IMailDetails {
  email: string;
  origin: string;
  verificationToken: string;
  name: string;
}

const sendVerificationMail = ({email, origin, verificationToken, name}: IMailDetails) => {
  // This route is a temporary one. It should be determined by the frontend
  const route = "/api/v1/auth/verify-email";
  const verifyLink = `${
    origin + route
  }?token=${verificationToken}&email=${email}`;

  const html = `<h4>Hello, ${name}</h4>,
  <p>Please verify your email by clicking on the following link: <a href="${verifyLink}">Verify Email</a></p>`;

  return sendMail({
    to: email,
    subject: "Email Verification",
    html,
  });
};

export default sendVerificationMail