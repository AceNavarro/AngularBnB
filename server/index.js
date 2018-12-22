const express = require("express"),
      mongoose = require("mongoose"),
      config = require("./config/dev"),
      FakeDb = require("./models/fake-db");


// ===== DATABASE =============================================================
mongoose.connect(config.DB_URI, {
    useNewUrlParser: true, 
    useCreateIndex: true 
  })
  .then(() => {
    new FakeDb().seedDb();
  });

// ===== APP SETUP ============================================================
const app = express();
app.use(express.json());


// ===== ROUTES ===============================================================
app.use("/api/v1/rentals", require("./routes/rentals"));
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/bookings", require("./routes/bookings"));


// ===== LISTEN ===============================================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});