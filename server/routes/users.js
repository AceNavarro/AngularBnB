const router = require("express").Router(),
      UserController = require("../controllers/user");

router.post("/auth", UserController.auth);

router.post("/register", UserController.register);

module.exports = router;