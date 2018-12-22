const mongoose = require("mongoose"),
      bcrypt = require('bcrypt');

const saltRounds = 10;

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    minlength: [3, "Too short, min is 3 characters."],
    maxlength: [32, "Too long, max is 32 characters."] 
  },
  email: { 
    type: String, 
    required: true, 
    minlength: [4, "Too short, min is 4 characters."],
    maxlength: [32, "Too long, max is 32 characters."],
    lowercase: true,
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/]
  },
  password: { 
    type: String, 
    required: true, 
    minlength: [4, "Too short, min is 4 characters."],
    maxlength: [32, "Too long, max is 32 characters."] ,
  },
  rentals: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Rental" }],
  bookings: [{ type: mongoose.SchemaTypes.ObjectId, ref: "Booking" }]
});

userSchema.methods.isSamePassword = function(requestedPassword) {
  return bcrypt.compareSync(requestedPassword, this.password);
};

userSchema.pre("save", function(next) {
  const user = this;
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;
        next();
    });
  });
});

module.exports = mongoose.model("User", userSchema);