const Booking = require("../models/booking"),
      Rental = require("../models/rental"),
      User = require("../models/user"),
      moment = require("moment"),
      { normalizeErrors } = require("../helpers/mongoose");


exports.createBooking = async function(req, res) {
  const { startAt, endAt, totalPrice, guests, days, rental } = req.body;
  const user = res.locals.user;
  const booking = new Booking({ startAt, endAt, totalPrice, guests, days });
  
  try {
    var foundRental = await Rental.findById(rental._id)
      .populate("bookings")
      .populate("user");
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }

  if (!foundRental) {
    return res.status(422).send({ errors: [{ 
      title: "Invalid booking", 
      detail: "The target rental for booking is no longer existing!" }]});
  }

  if (foundRental.user.id === user.id) {
    return res.status(422).send({ errors: [{ 
      title: "Invalid user", 
      detail: "Cannot create a booking on your own rental!" }]});
  }

  if (!isValidBookingDates(booking, foundRental)) {
    return res.status(422).send({ errors: [{ 
      title: "Invalid booking", 
      detail: "The chosen dates are already taken!" }]});
  }

  try {
    booking.rental = foundRental;
    booking.user = user;
    await booking.save();

    await Rental.findOneAndUpdate({ _id: foundRental._id }, { $push: { bookings: booking } });
    await User.findOneAndUpdate({ _id: booking._id }, { $push: { bookings: booking } });

    res.json({
      startAt: booking.startAt, 
      endAt: booking.endAt
    });
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};


function isValidBookingDates(proposedBooking, rental) {
  if (!rental.bookings || rental.bookings.length == 0) {
    return true;
  }

  const isOverlapFound = rental.bookings.some(booking => {
    const proposedStart = moment(proposedBooking.startAt);
    const proposedEnd = moment(proposedBooking.endAt);

    const bookingStart = moment(booking.startAt);
    const bookingEnd = moment(booking.endAt);

           // Invalid if start is inside of an existing booking
    return (proposedStart >= bookingStart && proposedStart < bookingEnd) ||
           // Invalid if end is inside of an existing booking
           (proposedEnd > bookingStart && proposedEnd <= bookingEnd) ||
           // Invalid if new booking covers an existing booking
           (proposedStart <= bookingStart && proposedEnd >= bookingEnd);
  });

  return !isOverlapFound;
}