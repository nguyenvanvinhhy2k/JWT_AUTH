const router = require("express").Router();
const authController = require("../controllers/authControllers");
const userController = require("../controllers/userControllers");

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/refresh", authController.refreshToken);
router.get("/getall", userController.userGetAll);

module.exports = router;
