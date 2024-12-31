const express = require("express");
const router = express.Router();
const {
  getConversations,
  searchUsers,
  startChat,
  getChatPage,
  sendMessage,
} = require("../controllers/conversationController");
const verifyToken = require("../middlewares/authenticate");
router.get("/", verifyToken, getConversations);
router.get("/search", verifyToken, searchUsers);
router.get("/start-chat/:userId", verifyToken, startChat);
router.get("/chat/:userId", verifyToken, getChatPage);
router.post("/chat/:userId", verifyToken, sendMessage);

module.exports = router;
