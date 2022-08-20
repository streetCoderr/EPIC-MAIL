import express, { Router } from "express";
const router: Router = express.Router();
import {
  sendMessage,
  getMessage,
  getInbox,
  getMessages,
  retractMessage,
  saveAsDraft,
} from "../controller/messageController";

router.route("/").post(sendMessage).get(getMessages);
router.get("/inbox", getInbox);
router.patch("/retract/:messageID", retractMessage);
router.post("/draft", saveAsDraft);
router.get("/:messageID", getMessage);

export default router;
