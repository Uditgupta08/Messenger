const Conversation = require("../models/conversationModel");
const User = require("../models/userModel");
const Message = require("../models/messageModel");

const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Conversation.find({
      members: { $in: [userId] },
    })
      .populate("members", "username fullname profilePic")
      .populate({
        path: "lastMessage",
        select: "content senderId createdAt",
        populate: {
          path: "senderId",
          select: "username",
        },
      });
    const filteredConversations = conversations.filter(
      (convo) => convo.members && convo.members.length > 0
    );

    res.render("conversations", { conversations: filteredConversations });
  } catch (err) {
    res.status(500).json(err);
  }
};

const searchUsers = async (req, res) => {
  try {
    const { username } = req.query;
    if (typeof username !== "string") {
      return res.status(400).json({ error: "Username must be a string" });
    }

    const users = await User.find({
      username: { $regex: username, $options: "i" },
    });
    res.json({ users });
  } catch (err) {
    res.status(500).json(err);
  }
};

const startChat = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;
    let conversation = await Conversation.findOne({
      members: { $all: [currentUserId, userId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [currentUserId, userId],
      });
    }

    res.redirect(`/chat/${conversation._id}`);
  } catch (err) {
    res.status(500).json(err);
  }
};

const getChatPage = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    // Find or create conversation
    let conversation = await Conversation.findOne({
      members: { $all: [currentUserId, userId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [currentUserId, userId],
      });
    }

    // Fetch messages and user details
    const messages = await Message.find({
      conversationId: conversation._id,
    }).populate("senderId", "username");

    const user = await User.findById(userId);

    res.render("chat", { user, messages, conversation });
  } catch (err) {
    res.status(500).json(err);
  }
};

const sendMessage = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?.id;
    if (!currentUserId) {
      return res.status(400).json({ error: "User not authenticated" });
    }
    const { message } = req.body;
    let conversation = await Conversation.findOne({
      members: { $all: [currentUserId, userId] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        members: [currentUserId, userId],
      });
    }
    const newMessage = await Message.create({
      content: message,
      senderId: currentUserId,
      conversationId: conversation._id,
    });
    res.redirect(`/conversations/chat/${userId}`);
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = {
  getConversations,
  searchUsers,
  startChat,
  getChatPage,
  sendMessage,
};
