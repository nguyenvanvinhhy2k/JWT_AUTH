const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const authController = {
  //REGISTER
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);
      //Create new user
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });
      //Save user to DB
      const user = await newUser.save();
      res.status(200).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  //LOGIN
  loginUser: async (req, res) => {
    try {
      // Find usename
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        res.status(404).json("Wrong username!");
      }
      // Compare password
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        res.status(404).json("Wrong password!");
      }
      if (user && validPassword) {
        // Sign = tạo token
        const token = jwt.sign(
          {
            id: user.id,
            isAdmin: user.isAdmin,
          }, // Tạo mã token có id và isAdmin
          process.env.TOKEN_KEY, // Mã secretKey
          { expiresIn: "30s" } // Time hết hạn token
        );
        // Sign = tạo refresh token
        const RefreshToken = jwt.sign(
          {
            id: user.id,
            isAdmin: user.isAdmin,
          }, // Tạo mã refresh token có id và isAdmin
          process.env.TOKEN_KEY, // Mã secretKey
          { expiresIn: "365d" } // Time hết hạn refresh token
        );
        const { password, ...orther } = user._doc; // Trả về tt user trừ password
        res.status(200).json({ ...orther, token, RefreshToken });
      }
    } catch (error) {
      res.status(500).json(err);
    }
  },
};

module.exports = authController;
