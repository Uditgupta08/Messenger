const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const registerUser = async (req, res) => {
  try {
    const newUser = req.body;
    if (req.files && req.files.profilePic) {
      newUser.profilePic = req.files.profilePic[0].path;
    }
    const user = await User.create(newUser);
    const token = jwt.sign({ user_id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).render("success", { user, token });
  } catch (err) {
    res.status(500).json(err);
  }
};

const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.render("login", { error: "NO USER FOUND" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.render("login", { error: "INVALID PASSWORD" });
    }
    const accessToken = jwt.sign({ _id: user.id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.status(200).render("success", { user, token: accessToken });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json(err);
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("accessToken", { path: "/" });
  console.log("accessToken cookie cleared");
  res.redirect("/login");
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
