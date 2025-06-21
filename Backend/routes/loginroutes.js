const express = require("express");
const router = express.Router();
const { loginUser } = require("../controllers/logincontroller");

// 🔐 Login route
router.post("/login", loginUser);

// 🔍 Get current logged-in user info
router.get("/current", (req, res) => {
  if (req.session.user) {
    res.status(200).json(req.session.user);
  } else {
    res.status(401).json({ msg: "No active session" });
  }
});

// 🚪 Logout route
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ msg: "Logout failed" });
    }
    res.clearCookie("connect.sid"); // remove session cookie from browser
    res.status(200).json({ msg: "Logged out successfully" });
  });
});

module.exports = router;
