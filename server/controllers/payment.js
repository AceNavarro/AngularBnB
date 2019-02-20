const Payment = require("../models/payment"),
      Booking = require("../models/booking"),
      User = require("../models/user"),
      Rental = require("../models/rental"),
      config = require("../config"),
      { normalizeErrors } = require("../helpers/mongoose");

const stripe = require("stripe")(config.STRIPE_SK);


exports.getUserPayments = async (req, res) => {
  // Get logged-in user
  const user = res.locals.user;

  try {
    // Get payment based on user and populate some properties
    const payments = await Payment
      .where({ toUser: user })
      .populate({
        path: "booking",
        populate: { path: "rental" }
      })
      .populate("fromUser");
    
    return res.json(payments);
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};


exports.confirmPayment = async (req, res) => {
  const payment = req.body;
  const booking = payment.booking;
  const user = res.locals.user;

  try {
    // Get payment from database
    const foundPayment = await Payment.findById(payment._id)
      .populate("toUser")
      .populate("fromUser")
      .populate({
        path: "booking",
        populate: { path: "rental" }
      });
    const booking = foundPayment.booking;

    // Check for correct payment status
    if (foundPayment.status !== "pending") {
      return res.status(422).send({ errors: [{ 
        title: "Invalid payment", 
        detail: "Cannot confirm a payment that has already been confirmed or declined." }]});
    }

    // Check for correct user
    if (user.id !== foundPayment.toUser.id) {
      return res.status(422).send({ errors: [{ 
        title: "Invalid user", 
        detail: "Cannot confirm a payment that belongs to another user." }]});
    }

    const charge = await stripe.charges.create({
      amount: foundPayment.amount,
      currency: "usd",
      customer: foundPayment.fromStripeCustomerId,
      receipt_email: foundPayment.fromUser.email,
      description: "Homebnb Angular Booking: " + booking.rental.title
    });

    if (!charge) {
      return res.status(422).send({ errors: [{ 
        title: "Invalid payment", 
        detail: "Payment cannot be processed." }]});
    }

    // Update the booking status
    await Booking.findOneAndUpdate({ _id: booking._id }, { $set: { status: "active" }});

    // Update the payment model
    foundPayment.charge = charge;
    foundPayment.status = "paid";
    await foundPayment.save();

    // Update user revenue
    res.locals.user = await User.findOneAndUpdate({ _id: user._id }, 
                                                  { $inc: { revenue: foundPayment.amount / 100 }}, 
                                                  { new: true });

    return res.json({ status: "confirmed" });
    
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};


exports.declinePayment = async (req, res) => {
  const payment = req.body;
  const user = res.locals.user;

  try {
    // Get payment from database
    const foundPayment = await Payment.findById(payment._id)
      .populate("toUser")
      .populate("booking");
    const booking = foundPayment.booking;
    const rental = booking.rental;

    // Check for correct payment status
    if (foundPayment.status !== "pending") {
      return res.status(422).send({ errors: [{ 
        title: "Invalid payment", 
        detail: "Cannot decline a payment that has already been confirmed or declined." }]});
    }

    // Check for correct user
    if (user.id !== foundPayment.toUser.id) {
      return res.status(422).send({ errors: [{ 
        title: "Invalid user", 
        detail: "Cannot decline a payment that belongs to another user." }]});
    }

    // Delete the booking
    await Booking.deleteOne({ _id: booking._id });

    // Update the payment status to "decline"
    await Payment.findOneAndUpdate({ _id: foundPayment._id }, { $set: { status: "declined" }});

    // Remove the booking from the Rental
    await Rental.findOneAndUpdate({ _id: rental._id }, { $pull: { bookings: booking._id }});

    // Remove the booking from the user
    await User.findOneAndUpdate({ _id: booking.user._id }, { $pull: { bookings: booking._id }});

    return res.json({ status: "declined" });
    
  } catch (err) {
    return res.status(422).send({ errors: normalizeErrors(err.errors) });
  }
};