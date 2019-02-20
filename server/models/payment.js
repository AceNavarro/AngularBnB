const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  fromUser: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  fromStripeCustomerId: String,
  toUser: { type: mongoose.SchemaTypes.ObjectId, ref: "User" },
  booking: { type: mongoose.SchemaTypes.ObjectId, ref: "Booking" },
  amount: Number,
  tokenId: String,
  charge: mongoose.SchemaTypes.Mixed,
  status: { type: String, default: "pending" }
}, { 
  // Automatically add createdAt and updatedAt properties
  timestamps: true
});

module.exports = mongoose.model("Payment", paymentSchema);