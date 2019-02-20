const router = require("express").Router(),
      PaymentController = require("../controllers/payment"),
      UserController = require("../controllers/user");

router.get("", UserController.authMiddleware, PaymentController.getUserPayments);

router.post("/accept", UserController.authMiddleware, PaymentController.confirmPayment);

router.post("/decline", UserController.authMiddleware, PaymentController.declinePayment);

module.exports = router;