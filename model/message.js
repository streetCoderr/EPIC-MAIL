const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: "no-title",
    trim: true,
    maxlength: 50
  },
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
  sentDate: Date,
}, {timestamps: true})

module.exports = mongoose.model('Message', MessageSchema)