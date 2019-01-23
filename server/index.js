const express = require("express"),
      mongoose = require("mongoose"),
      config = require("./config"),
      FakeDb = require("./fake-db"),
      path = require("path");


// ===== DATABASE =============================================================
mongoose.connect(config.DB_URI, {
    useNewUrlParser: true, 
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    if (process.env.NODE_ENV !== "production") {
      // new FakeDb().seedDb();
    }
  });


// ===== APP SETUP ============================================================
const app = express();
app.use(express.json());

if (process.env.NODE_ENV === "production") {
  appPath = path.join(__dirname, "..", "dist", "AngularBnB")
  app.use(express.static(appPath));
}


// ===== ROUTES ===============================================================
app.use("/api/v1/rentals", require("./routes/rentals"));
app.use("/api/v1/users", require("./routes/users"));
app.use("/api/v1/bookings", require("./routes/bookings"));

if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(appPath, "index.html"));
  });
}


// ===== LISTEN ===============================================================
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});