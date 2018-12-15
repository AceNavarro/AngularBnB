const express = require("express"),
      mongoose = require("mongoose"),
      config = require("./config/dev"),
      Rental = require("./models/rental"),
      FakeDb = require("./models/fake-db");


// ===== DATABASE =============================================================
mongoose.connect(config.DB_URI, { useNewUrlParser: true })
  .then(() => {
    new FakeDb().seedDb();
  });

// ===== APP SETUP ============================================================
const app = express();


// ===== ROUTES ===============================================================
app.use("/api/v1/rentals", require("./routes/rentals"));


// ===== LISTEN ===============================================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});