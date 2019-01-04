const router = require("express").Router(),
      RentalController = require("../controllers/rental"),
      UserController = require("../controllers/user");

router.get("/", RentalController.getRentals);

router.get("/:id", UserController.authMiddleware, RentalController.getRentalById);

router.post("/", UserController.authMiddleware, RentalController.createRental);

module.exports = router;