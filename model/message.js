const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "please provide title/subject of the message"],
    default: "no-title",
    trim: true,
    maxlength: 50
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
    required: [true, "please provide receiver's id"]
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