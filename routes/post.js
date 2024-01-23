const express = require("express");
const router = express.Router();
const {
  createPost,
  getUserPost,
  updatePost,
  deletePost,
} = require("../controllers/post");

router.get("/", getUserPost);
router.post("/create-post", createPost);
router.put("/update-post/:postId", updatePost);
router.delete("/delete-post/:postId", deletePost);

module.exports = router;
