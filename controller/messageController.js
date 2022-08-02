const Message = require("../model/message");
const User = require("../model/user");
const Conversation = require("../model/conversation")
const mongoose = require("mongoose")

const { asyncErrorCatcher } = require("../middleware");
const {
  default: { isEmail },
} = require("validator");
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require("../error");
const { StatusCodes } = require("http-status-codes");

const sendMessage = asyncErrorCatcher(async (req, res) => {
  const { content, recipient } = req.body;
  if (!recipient)
    throw new BadRequestError("Please provide recipient's email or username");

  const anEmail = isEmail(recipient) ? 1 : 0;
  let receiver = anEmail
    ? await User.findOne({ email: recipient.toLowerCase().trim() })
    : await User.findOne({ userName: recipient.trim() });

  if (!receiver)
    throw new NotFoundError(
      `Could not find a user with ${anEmail ? "email" : "username"}: recipient`
    );

  if (String(receiver._id) === req.user.userId) {
    throw new BadRequestError("You can't send a message to yourself");
  }

  const sender = req.user.userId;
  receiver = receiver._id;

  let conversation = await Conversation.findOne({
    $or: [
      {
        lastSender: sender,
        lastReceiver: receiver,
      },
      {
        lastSender: receiver,
        lastReceiver: sender,
      }
    ]
  })

  if (conversation) {
    if (String(conversation.lastSender) !== sender) {
      conversation.lastSender = sender
      conversation.lastReceiver = receiver
      await conversation.save()
    }
  } else {
    conversation = await Conversation.create({
      lastSender: sender,
      lastReceiver: receiver
    })
  }

  const message = await Message.create({
    conversationID: conversation._id,
    content,
    sender,
    receiver,
  });

  res.status(StatusCodes.OK).json({
    msg: "Message successfully sent",
    sentMessage: message,
  });
});

const getMessage = asyncErrorCatcher(async (req, res) => {
  const { id } = req.params;
  const message = await Message.findOne({ _id: id });

  if (!message)
    throw new NotFoundError(
      `Could not find any message associated with id: ${id}`
    );

  const userId = req.user.userId;
  if (userId != String(message.sender) && userId != String(message.receiver))
    throw new UnauthorizedError(
      "You do not have permission to access this message"
    );
  
  if (message.status === "retracted") 
   throw new BadRequestError("The requested message has been retracted")

  res.status(StatusCodes.OK).json({ message });
});

const getInbox = asyncErrorCatcher(async (req, res) => {
  const inbox = await Message.aggregate(
    [
      {
        $match: {
          $or: [
            {
              sender: new mongoose.Types.ObjectId(req.user.userId)
            },
            {
              receiver: new mongoose.Types.ObjectId(req.user.userId)
            }
          ]
        }
      },
      {
        $sort: {
          updatedAt: 1
        }
      },
      {
        $group: {
          _id: "$conversationID",
          messages: {
            $push: "$$ROOT"
          }
        }
      }
    ]
  )
  
  res.status(StatusCodes.OK).json({inbox})

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
