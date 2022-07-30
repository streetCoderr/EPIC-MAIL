const Message = require('../model/message')
const {asyncErrorCatcher} = require("../middleware")

const sendMessage = asyncErrorCatcher(async (req, res) => {
  res.send("send message");
})

const getMessage = asyncErrorCatcher(async (req, res) => {
  res.send("get message");
})

const getInbox = asyncErrorCatcher(async (req, res) => {
  res.send("getInbox")
})

const getThread = asyncErrorCatcher(async (req, res) => {
  res.send("getThread");
})

const retractMessage = asyncErrorCatcher(async (req, res) => {
  res.send("retract message");
})

module.exports = {
  sendMessage,
  getMessage,
  getInbox,
  getThread,
  retractMessage,
}