const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  endAt: { type: Date, required: true },
  startAt: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  days: { type: Number, required: true },
  guests: { type: Number, required: true },
  user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  rental: { type: mongoose.SchemaTypes.ObjectId, ref: "Rental" }
}, { 
  // Automatically add createdAt and updatedAt properties
  timestamps: true
});

module.exports = mongoose.model("Booking", bookingSchema);