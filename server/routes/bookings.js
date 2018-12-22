const router = require("express").Router(),
      BookingController = require("../controllers/booking"),
      UserController = require("../controllers/user");

router.post("/", UserController.authMiddleware, BookingController.createBooking);

module.exports = router;