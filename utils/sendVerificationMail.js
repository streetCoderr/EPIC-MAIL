const sendMail = require("./sendEmail");

const sendVerificationMail = ({ email, origin, verificationToken, name }) => {
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

module.exports = sendVerificationMail;
