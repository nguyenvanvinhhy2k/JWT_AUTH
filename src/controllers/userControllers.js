const User = require("../models/user");

const userController = {
  // Getall users
  userGetAll: async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  },
  // Delete users
  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Delete successful");
    } catch (error) {
      res.status(500).json(error);
    }
  },
};

module.exports = userController;
