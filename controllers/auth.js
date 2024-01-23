const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
const User = require("../models/User");

// @desc register User
// route POST /auth/register
// @access Public
const registerUser = async (req, res, next) => {
  try {
    const user = await User.create({ ...req.body });
    const token = user.createJWT();
    const { password, ...userWithoutPassword } = user._doc;
    res.status(201).json({ user: userWithoutPassword, token: token });
  } catch (error) {
    next(error);
  }
};

// @desc login User/Set token
// route POST /auth/login
// @access Public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Please provide email or password");
    }
    const user = await User.findOne({ email });
    if (!user) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    const token = user.createJWT();
    res.setHeader("Authorization", `Bearer ${token}`);

    const sanitizedUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dateAdded: user.dateAdded,
      _id: user._id,
    };
    res.status(200).json({ user: sanitizedUser, token: token });
  } catch (error) {
    next(error);
  }
};

// @desc update User details
// route POST /auth/profile
// @access Private
const updateUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    } else {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }
      await user.save();
      const sanitizedUser = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        dateAdded: user.dateAdded,
        _id: user._id,
      };
      res.status(200).json({
        user: sanitizedUser,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc logout User
// route POST /auth/logout
// @access Private
const logoutUser = (req, res, next) => {
  try {
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "POST");
      res.status(200).end();
      return;
    }

    delete req.headers.authorization;
    res.status(200).json({ success: true, message: "Logout Successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
  logoutUser,
};
