const Message = require("../model/message");
const User = require("../model/user");
const Conversation = require("../model/conversation")
const mongoose = require("mongoose")

const { asyncErrorCatcher } = require("../middleware");
const {
  default: { isEmail, isMongoId },
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
        initiator: sender,
        partaker: receiver,
      },
      {
        initiator: receiver,
        partaker: sender,
      }
    ]
  })

  if (!conversation) {
    conversation = await Conversation.create({
      initiator: sender,
      partaker: receiver
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
  const { messageID } = req.params;
  const message = await Message.findOne({ _id: messageID });

  if (!message)
    throw new NotFoundError(
      `Could not find any message associated with id: ${messageID}`
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
              sender: new mongoose.Types.ObjectId(req.user.userId),
              status: "sent",
            },
            {
              receiver: new mongoose.Types.ObjectId(req.user.userId),
              status: "sent",
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

  const { conversationID } = req.params

  if (!(isMongoId(conversationID)))
    throw new BadRequestError(`${conversationID} is not a valid conversation ID`)

  const thread = await Message.find({
    $or:
      [
        {
          conversationID,
          status: "sent",
          sender: req.user.userId
        },
        {
          conversationID,
          status: "sent",
          receiver: req.user.userId
        }
      ]
    }).sort({updatedAt: 1});

  res.status(StatusCodes.OK).json({thread})
});

const retractMessage = asyncErrorCatcher(async (req, res) => {
  const {messageID} = req.params
  const message = await Message.findOne({
    _id: messageID,
    sender: req.user.userId
  })

  if (!message)
    throw new NotFoundError(`You do not have any message associated with id: ${messageID}`)

  const {status} = message
  
  if (status == "retracted")
    throw new BadRequestError("This message has already been retracted")

  if (status == "draft")
    throw new BadRequestError("You can only retract a sent message")
  
  message.status = "retracted"
  await message.save()

  res.status(StatusCodes.OK).json({msg: "Successfully retracted"})
});

const saveAsDraft = asyncErrorCatcher(async (req, res) => {
  const { content } = req.body
  const message = await Message.create({
    content, sender: req.user.userId, status: "draft"
  })

  res.status(StatusCodes.OK).json({message})
})

module.exports = {
  sendMessage,
  getMessage,
  getInbox,
  getThread,
  retractMessage,
  saveAsDraft,
};
