const jwt = require("jsonwebtoken");

const middlewareControllers = {
  // Xác nhận token
  verifyToken: (req, res, next) => {
    const token = req.headers.token;
    if (token) {
      const accessToken = token.split(" ")[1];
      // verify = Xác nhận token
      jwt.verify(accessToken, process.env.TOKEN_KEY, (error, user) => {
        if (error) {
          res.status(403).json("Token is not valid");
        }
        req.user = user;
        next(); // next = Thoả điều kiện thì đi tiếp
      });
    } else {
      res.status(401).json("You not authenticated");
    }
  },
  verifyTokenAdminAuth: (req, res, next) => {
    middlewareControllers.verifyToken(req, res, () => {
      // middlewareControllers.verifyToken = lấy token
      if (req.user.id == req.params.id || req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You not allowed to delete orther");
      }
    });
  },
};

module.exports = middlewareControllers;
