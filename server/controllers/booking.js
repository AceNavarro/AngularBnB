const Booking = require("../models/booking"),
      Rental = require("../models/rental"),
      User = require("../models/user"),
      Payment = require("../models/payment"),
      moment = require("moment"),
      config = require("../config"),
      { normalizeErrors } = require("../helpers/mongoose");

const stripe = require("stripe")(config.STRIPE_SK);

// Percentage of customer share. The remaining will be for the website owner.
const CUSTOMER_SHARE = 0.9;


exports.createBooking = async function(req, res) {
  const { startAt, endAt, totalPrice, guests, days, rental, paymentToken } = req.body;
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
    const { payment, err } = await createPayment(booking, foundRental.user, paymentToken);

    if (err) {
      return res.status(422).send({ errors: [{ 
        title: "Invalid payment", 
        detail: err }]});
    }

    booking.payment = payment;
    await booking.save();

    await Rental.findOneAndUpdate({ _id: foundRental._id }, { $push: { bookings: booking } });
    res.locals.user = await User.findOneAndUpdate({ _id: user._id }, { $push: { bookings: booking } }, { new: true });

    res.json({
      startAt: booking.startAt,
      endAt: booking.endAt
    });
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};


exports.getUserBookings = async (req, res) => {
  try {
    const user = res.locals.user;
    const bookings = await Booking.find({ user }).populate("rental");
    res.json(bookings);
  } catch (err) {
    res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};


async function createPayment(booking, toUser, token) {
  let fromUser = booking.user;

  if (!fromUser.stripeCustomerId) {
    const customer = await stripe.customers.create({
      source: token.id,
      email: fromUser.email
    });
    
    if (customer) {
      fromUser = await User.findOneAndUpdate({ _id: fromUser.id }, { $set: { stripeCustomerId: customer.id }}, { new: true });
    } else {
      return { err: "Cannot process payment!" };
    }
  }

  const payment = new Payment({
    fromUser,
    fromStripeCustomerId: fromUser.stripeCustomerId,
    toUser,
    booking,
    tokenId: token.id,
    amount: booking.totalPrice * 100 * CUSTOMER_SHARE  // amount is multiplied by 100 because value is in cents
  });

  try {
    const savedPayment = await payment.save();
    return { payment: savedPayment };
  } catch (err) {
    return { err: err.message };
  }
}


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