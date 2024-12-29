const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
} = require("../controllers/userController");
const verifyToken = require("../middlewares/authenticate");
const upload = require("../middlewares/upload");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", loginUser);

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", upload, registerUser);

router.post("/logout", logoutUser);

module.exports = router;
