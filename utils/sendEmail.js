const nodemailer = require('nodemailer');
const nodemailerConfig = require('./nodeMailerConfig')


const sendMail = async ({to, subject, html}) => {
  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: '"Epic-Mail" <steve@epicmail.com>',
    to,
    subject,
    html,
  });
}

module.exports = sendMail