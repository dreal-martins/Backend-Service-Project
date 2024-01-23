const { NotFoundError } = require("../errors");
const User = require("../models/User");
// @desc Get Users
// route GET /user/
// @access Private
const getUsers = async (req, res, next) => {
  try {
    const filters = {};

    if (req.query.dateAdded) {
      filters.dateAdded = { $gte: new Date(req.query.dateAdded) };
    }

    if (req.query.firstName) {
      filters.firstName = { $regex: new RegExp(req.query.firstName, "i") };
    }

    if (req.query.lastName) {
      filters.lastName = { $regex: new RegExp(req.query.lastName, "i") };
    }

    const users = await User.find(filters);
    if (!users) {
      throw new NotFoundError("user not found");
    }
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
};
