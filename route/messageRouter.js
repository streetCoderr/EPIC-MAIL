const express = require("express")
const router = express.Router()
const {
  sendMessage,
  getMessage,
  getInbox,
  getMessages,
  retractMessage,
  saveAsDraft
} = require("../controller/messageController")

router.route('/').post(sendMessage).get(getMessages)
router.get('/inbox', getInbox)
router.patch('/retract/:messageID', retractMessage)
router.post('/draft', saveAsDraft)
router.get('/:messageID', getMessage)

module.exports = router