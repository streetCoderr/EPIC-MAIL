const Message = require("../model/message");
const User = require("../model/user");
// const Conversation = require("../model/conversation")

const { asyncErrorCatcher } = require("../middleware");

const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../error");
const { StatusCodes } = require("http-status-codes");

const sendMessage = asyncErrorCatcher(async (req, res) => {
  const { subject, content, recipient } = req.body;
  if (!recipient)
    throw new BadRequestError("Please provide recipient's email or username");

  let receiver = await User.findOne({ email: recipient.toLowerCase().trim() })

  if (!receiver)
    throw new NotFoundError(
      "Could not find a user with email: recipient"
    );

  if (String(receiver._id) === req.user.userId) {
    throw new BadRequestError("You can't send a message to yourself");
  }

  const sender = req.user.userId;
  receiver = receiver._id;

  const message = await Message.create({
    subject,
    content,
    sender,
    receiver,
  });

  res.status(StatusCodes.OK).json({
    message
  });
});

const getMessage = asyncErrorCatcher(async (req, res) => {
  const { messageID } = req.params;
  const message = await Message.findOne({ 
    _id: messageID,
    status: "sent" 
  });

  if (!message)
    throw new NotFoundError(
      `Could not find any message associated with id: ${messageID}`
    );

  const userId = req.user.userId;
  if (userId != String(message.sender) && userId != String(message.receiver))
    throw new UnauthorizedError(
      "You do not have permission to access this message"
    );
  
  res.status(StatusCodes.OK).json({ message });
});

const getInbox = asyncErrorCatcher(async (req, res) => {
  const inbox = await Message.find({
    receiver: req.user.userId,
    status: "sent"
  }).sort({sentAt: -1})
  
  res.status(StatusCodes.OK).json({inbox})

});

const retractMessage = asyncErrorCatcher(async (req, res) => {
  const {messageID} = req.params
  const message = await Message.findOne({
    _id: messageID,
    sender: req.user.userId,
    status: "sent"
  })

  if (!message)
    throw new NotFoundError(`You do not have any message associated with id: ${messageID}`)  
  
  message.status = "retracted"
  await message.save()

  res.status(StatusCodes.OK).json({msg: "Successfully retracted"})
});

const saveAsDraft = asyncErrorCatcher(async (req, res) => {
  const { subject, content } = req.body
  const message = await Message.create({
    subject, content, sender: req.user.userId, status: "draft"
  })

  res.status(StatusCodes.OK).json({message})
})

const getMessages = asyncErrorCatcher(async (req, res) => {
  let status = req.query.status
  if (status) {
    status = status.trim().toLowerCase()
  }

  const messages = await Message.find({
    sender: req.user.userId,
    status: status
  })

  res.status(StatusCodes.OK).json({messages})
})

module.exports = {
  sendMessage,
  getMessage,
  getInbox,
  getMessages,
  retractMessage,
  saveAsDraft,
};
