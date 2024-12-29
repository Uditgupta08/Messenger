const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token = req.cookies.accessToken || req.headers["authorization"];
  console.log("Token:", token);
  if (!token) {
    console.log("NO TOKEN FOUND");
    req.isAuthenticated = false;
    return res.redirect("/users/login");
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    req.isAuthenticated = true;
    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    req.isAuthenticated = false;
    return res.redirect("/users/login");
  }
};
module.exports = verifyToken;
