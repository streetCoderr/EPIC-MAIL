import sendMail from "./sendEmail";

interface IMailDetails {
  email: string;
  origin: string;
  passwordToken: string;
  name: string;
}

const sendResetPasswordMail = ({
  email,
  origin,
  passwordToken,
  name,
}: IMailDetails) => {
  // This route is a temporary one. It should be determined by the frontend
  const route = "/api/v1/auth/reset-password";
  const verifyLink = `${origin + route}?token=${passwordToken}&email=${email}`;
  const html = `<h4>Hello, ${name}</h4>,
  <p>Please follow the provided link to reset your password: <a href="${verifyLink}">Reset password</a></p>
  <p><b>Note</b>: This link expires in 1 hour</p>`;

  return sendMail({
    to: email,
    subject: "Reset Password",
    html,
  });
};

export default sendResetPasswordMail;
