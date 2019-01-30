const router = require("express").Router(),
      RentalController = require("../controllers/rental"),
      UserController = require("../controllers/user");

router.get("/", RentalController.getRentals);

router.get("/manage", UserController.authMiddleware, RentalController.getUserRentals);

router.get("/:id/verify-user", UserController.authMiddleware, RentalController.verifyUser);

router.get("/:id", RentalController.getRentalById);

router.patch("/:id", UserController.authMiddleware, RentalController.updateRental);

router.post("/", UserController.authMiddleware, RentalController.createRental);

router.delete("/:id", UserController.authMiddleware, RentalController.deleteRental)

module.exports = router;