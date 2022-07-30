const Message = require("../model/message");
const User = require("../model/user");
const { asyncErrorCatcher } = require("../middleware");
const {
  default: { isEmail },
} = require("validator");
const { BadRequestError, NotFoundError } = require("../error");
const { StatusCodes } = require("http-status-codes");

const sendMessage = asyncErrorCatcher(async (req, res) => {
  const { title, content, recipient } = req.body;
  if (!recipient)
    throw new BadRequestError("Please provide recipient's email or username");

  const anEmail = isEmail(recipient) ? 1 : 0;
  const receiver = anEmail
    ? await User.findOne({ email: recipient.toLowerCase().trim() })
    : await User.findOne({ userName: recipient.trim() });

  if (!receiver)
    throw new NotFoundError(
      `Could not find a user with ${anEmail ? "email" : "username"}: recipient`
    );

  const message = await Message.create({
    title,
    content,
    sender: req.user.userId,
    receiver: receiver._id,
  });

  res.status(StatusCodes.OK).json({
    msg: "Message successfully sent",
    sentMessage: message,
  });
});

const getMessage = asyncErrorCatcher(async (req, res) => {
  res.send("get message");
});

const getInbox = asyncErrorCatcher(async (req, res) => {
  res.send("getInbox");
});

const getThread = asyncErrorCatcher(async (req, res) => {
  res.send("getThread");
});

const retractMessage = asyncErrorCatcher(async (req, res) => {
  res.send("retract message");
});

module.exports = {
  sendMessage,
  getMessage,
  getInbox,
  getThread,
  retractMessage,
};
