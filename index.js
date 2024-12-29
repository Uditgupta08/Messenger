const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const http = require("http");
require("dotenv").config();

const connectDB = require("./config/db");
connectDB();
const verifyToken = require("./middlewares/authenticate");
const upload = require("./middlewares/upload");

const app = express();
const server = http.createServer(app);
// Socket(server);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoute = require("./routes/userRoutes");
const conversationRouter = require("./routes/conversationRoutes");

app.use("/users", userRoute);
app.use("/conversations", conversationRouter);

app.use("/", (req, res) => {
  res.render("index");
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on ${port}✌️`);
});
