const router = require("express").Router(),
      UserController = require("../controllers/user");

router.post("/auth", UserController.auth);

router.post("/register", UserController.register);

router.patch("/:id", UserController.authMiddleware, UserController.updateUser);

router.get("/:id", UserController.authMiddleware, UserController.getUser);

module.exports = router;