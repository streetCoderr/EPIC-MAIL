const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  conversationID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Conversation"
  },
  content: {
    type: String,
    required: [true, "please provide message's content"],
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "please provide sender's id"]
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    enum: {
      values: ['draft', 'sent', 'retracted'],
      message: "{VALUE} is not a valid status"
    },
    required: true,
    default: 'sent',
  },
}, {timestamps: true})

module.exports = mongoose.model('Message', MessageSchema)