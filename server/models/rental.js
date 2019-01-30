const mongoose = require("mongoose");

const rentalSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: [128, "Too long, max is 128 characters."] },
  city: { type: String, required: true, lowercase: true },
  street: { type: String, required: true, minlength: [4, 'Too short, min is 4 characters'] },
  category: { type: String, required: true, lowercase: true },
  image: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  shared: Boolean,
  description: { type: String, required: true },
  dailyRate: { type: Number, required: true },
  user: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  bookings: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Booking" }]
}, { 
  // Automatically add createdAt and updatedAt properties
  timestamps: true
});

module.exports = mongoose.model("Rental", rentalSchema);