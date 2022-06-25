const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

const refreshTokens = [];
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
        const refreshToken = jwt.sign(
          {
            id: user.id,
            isAdmin: user.isAdmin,
          }, // Tạo mã refresh token có id và isAdmin
          process.env.TOKEN_KEY, // Mã secretKey
          { expiresIn: "365d" } // Time hết hạn refresh token
        );
        refreshTokens.push(refreshToken); // Lưu refresh token vào mảng
        res.cookie("refreshToken", refreshToken, {
          // Save refreshToken vào cookie
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const { password, ...orther } = user._doc; // Trả về tt user trừ password
        res.status(200).json({ ...orther, token });
      }
    } catch (error) {
      res.status(500).json(err);
    }
  },
  // REFRESH TOKEN
  refreshToken: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) res.status(401).json("You not authenticated");
      jwt.verify(refreshToken, process.env.TOKEN_KEY, (error, user) => {
        if (error) {
          console.log(error);
        }
        // Sign = tạo new token
        const newToken = jwt.sign(
          {
            id: user.id,
            isAdmin: user.isAdmin,
          }, // Tạo mã token có id và isAdmin
          process.env.TOKEN_KEY, // Mã secretKey
          { expiresIn: "30s" } // Time hết hạn token
        );
        // Sign = tạo new refresh token
        const newRefreshToken = jwt.sign(
          {
            id: user.id,
            isAdmin: user.isAdmin,
          }, // Tạo mã refresh token có id và isAdmin
          process.env.TOKEN_KEY, // Mã secretKey
          { expiresIn: "365d" } // Time hết hạn refresh token
        );
        res.cookie("refreshToken", newRefreshToken, {
          // Save refreshToken vào cookie
          httpOnly: true,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        res.status(200).json({ token: newToken });
      });
    } catch (error) {
      res.status(500).json(err);
    }
  },

  // LOGOUT
  logout: async (req, res) => {
    res.clearCookie("refreshToken");
    res.status(200).json("Log out success");
  },
};

module.exports = authController;
