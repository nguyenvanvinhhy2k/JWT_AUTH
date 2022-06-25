const router = require("express").Router();
const userController = require("../controllers/userControllers");
const middlewareControllers = require("../controllers/middlewareControllers");

router.get(
  "/getall",
  middlewareControllers.verifyToken,
  userController.userGetAll
);

router.delete(
  "/:id",
  middlewareControllers.verifyTokenAdminAuth,
  userController.deleteUser
);

module.exports = router;
