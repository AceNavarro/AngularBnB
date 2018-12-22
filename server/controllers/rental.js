const Rental = require("../models/rental"),
      { normalizeErrors } = require("../helpers/mongoose");

exports.getRentals = async (req, res) => {
  try {
    const rentals = await Rental.find().select("-bookings");
    res.json(rentals);
  } catch(err) {
    res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};

exports.getRentalById = async (req, res) => {
  try {
    const rental = await Rental.findById(req.params.id)
      .populate("bookings", "startAt endAt -_id")
      .populate("user", "username -_id");
    res.json(rental);
  } catch(err) {
    res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};