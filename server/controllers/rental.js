const Rental = require("../models/rental"),
      User = require("../models/user"),
      { normalizeErrors } = require("../helpers/mongoose");

exports.getRentals = async (req, res) => {
  try {
    let query = {};
    const search = req.query.search;

    if (search) {
      const regex = new RegExp(escapeRegex(search), "gi");
      query = {$or: [
        {title: regex},
        {city: regex},
        {street: regex},
        {category: regex},
        {description: regex}
      ]};
    }

    const rentals = await Rental.find(query).select("-bookings");

    if (search && rentals.length === 0) {
      return res.status(422).send({ errors: [{ 
        title: "No rental found!", 
        detail: "There are no rentals matching the search keyword(s)." }]});
    }

    res.json(rentals);
  } catch (err) {
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


exports.createRental = async (req, res) => {
  try {
    const rental = new Rental(req.body);
    const user = res.locals.user;
    rental.user = user;
    await rental.save();
    res.locals.user = await User.findOneAndUpdate({ _id: user._id }, { $push: { rentals: rental } }, { new: true });
    res.json({ id: rental._id });
  } catch (err) {
    res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};


// Escapes a regex input string to make safe from external attacks.
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};