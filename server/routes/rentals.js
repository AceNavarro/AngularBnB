const router = require("express").Router(),
      Rental = require("../models/rental"),
      UserController = require("../controllers/user"),
      { normalizeErrors } = require("../helpers/mongoose");

// INDEX
router.get("/", async (req, res) => {
  const rentals = await Rental.find();
  res.json(rentals);
});

// SHOW
router.get("/:id", (req, res) => {
  Rental.findById(req.params.id).exec()
    .then(rental => {
      res.json(rental);
    })
    .catch(err => {
      res.status(422).send({ errors: normalizeErrors(err.errors) });
    })
});

module.exports = router;