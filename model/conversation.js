const mongoose = require("mongoose")

const ConversationSchema = new mongoose.Schema({
  initiator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "please provide initiator's ID"]
  },
  partaker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "please provide partaker's ID"]
  }
}, {timestamps: true})

module.exports = mongoose.model("Conversation", ConversationSchema)