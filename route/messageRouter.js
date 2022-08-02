const express = require("express")
const router = express.Router()
const {
  sendMessage,
  getMessage,
  getInbox,
  getThread,
  retractMessage,
  saveAsDraft
} = require("../controller/messageController")

router.post('/', sendMessage)
router.get('/inbox', getInbox)
router.get('/inbox/:conversationID', getThread)
router.patch('/retract/:messageID', retractMessage)
router.post('/draft', saveAsDraft)
router.get('/:messageID', getMessage)

module.exports = router