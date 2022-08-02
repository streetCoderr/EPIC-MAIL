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
router.get('/inbox/:thread', getThread)
router.patch('/retract/:id', retractMessage)
router.post('/draft', saveAsDraft)
router.get('/:id', getMessage)

module.exports = router