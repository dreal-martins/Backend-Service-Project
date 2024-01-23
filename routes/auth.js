const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  updateUser,
  logoutUser,
} = require("../controllers/auth");
const auth = require("../middleware/authentication");

router.post("/login", loginUser);
router.post("/register", registerUser);
router.put("/profile", auth, updateUser);
router.post("/logout", auth, logoutUser);

module.exports = router;
