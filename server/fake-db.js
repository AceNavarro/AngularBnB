const Rental = require("./models/rental"),
      User = require("./models/user"),
      Booking = require("./models/booking"),
      Payment = require("./models/payment"),
      fakeDbData = require("./data.json");

class FakeDb {
  constructor() {
    this.rentals = fakeDbData.rentals;
    this.users = fakeDbData.users;
  }

  async cleanDb() {
    await Rental.deleteMany({});
    await User.deleteMany({});
    await Booking.deleteMany({});
    await Payment.deleteMany({});
  }

  async pushDataToDb() {
    const user = new User(this.users[0]);
    const user2 = new User(this.users[1]);

    this.rentals.forEach(async rental => {
      const newRental = new Rental(rental);
      newRental.user = user;
      user.rentals.push(newRental);
      await newRental.save();
    });

    await user.save();
    await user2.save();
  }

  async seedDb() {
    await this.cleanDb();
    await this.pushDataToDb();
  }
}

module.exports = FakeDb;