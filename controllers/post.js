const Post = require("../models/Post");
const User = require("../models/User");
const { NotFoundError } = require("../errors");

// @desc Get User Post
// route GET /get
// @access Private
const getUserPost = async (req, res, next) => {
  try {
    const posts = await Post.find().populate({
      path: "user",
      select: "-posts",
    });
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

// @desc Create New Post
// route POST /post/create-post
// @access Private
const createPost = async (req, res, next) => {
  try {
    const { title, content, userId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("user not found");
    }

    const post = await Post.create({ title, content, user: userId });
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

// @desc Update Post
// route PUT /post/update-post
// @access Private
const updatePost = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const postId = req.params.postId;

    const post = await Post.findByIdAndUpdate(
      postId,
      { title, content },
      { new: true }
    );

    if (!post) {
      throw new NotFoundError("post not found");
    }

    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

// @desc Delete Post
// route DELETE /post/delte-post
// @access Private
const deletePost = async (req, res, next) => {
  try {
    const postId = req.params.postId;

    const post = await Post.findByIdAndDelete(postId);

    if (!post) {
      throw new NotFoundError("post not found");
    }

    const user = await User.findByIdAndUpdate(
      post.user,
      { $pull: { posts: postId } },
      { new: true }
    );

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getUserPost, createPost, updatePost, deletePost };
