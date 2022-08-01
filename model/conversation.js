const mongoose = require("mongoose")

const ConversationSchema = new mongoose.Schema({
  lastSender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "please provide last sender's ID"]
  },
  lastReceiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "please provide last receiver's ID"]
  }
}, {timestamps: true})

module.exports = mongoose.model("Conversation", ConversationSchema)