const express = require("express")
const router = express.Router()
const {
  sendMessage,
  getMessage,
  getInbox,
  getThread,
  retractMessage,
} = require("../controller/messageController")

router.post('/', sendMessage)
router.get('/getInbox', getInbox)
router.get('/getThread', getThread)
router.patch('/retractMessage', retractMessage)
router.get('/:id', getMessage)

module.exports = router