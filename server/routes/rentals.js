const router = require("express").Router(),
      Rental = require("../models/rental");

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
      res.status(422).send({ errors: [{ title: "Rental Error", detail: "Could not find rental!" }]});
    })
});

module.exports = router;