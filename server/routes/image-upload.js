const router = require("express").Router(),
      ImageUploadController = require("../controllers/image-upload"),
      UserController = require("../controllers/user");

router.post("/image-upload", UserController.authMiddleware, ImageUploadController.uploadImage);

module.exports = router;