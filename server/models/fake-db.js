const Rental = require("./rental"),
      User = require("./user");

class FakeDb {
  constructor() {
    this.rentals = [{
      title: "Nice view on ocean",
      city: "San Francisco",
      street: "Main street",
      category: "condo",
      image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
      bedrooms: 4,
      shared: true,
      description: "Very nice apartment in center of the city.",
      dailyRate: 43
    },
    {
      title: "Modern apartment in center",
      city: "New York",
      street: "Time Square",
      category: "apartment",
      image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
      bedrooms: 1,
      shared: false,
      description: "Very nice apartment in center of the city.",
      dailyRate: 11
    },
    {
      title: "Old house in nature",
      city: "Spisska Nova Ves",
      street: "Banicka 1",
      category: "house",
      image: "https://booksync-jerga-prod.s3.amazonaws.com/uploads/rental/image/5/image.jpeg",
      bedrooms: 5,
      shared: true,
      description: "Very nice apartment in center of the city.",
      dailyRate: 23
    }];

    this.users = [
      {
        username: "dev",
        email: "dev@gmail.com",
        password: "password",
        rentals: []
      },
      {
        username: "dev2",
        email: "dev2@gmail.com",
        password: "password",
        rentals: []
      },
    ];

  }

  async cleanDb() {
    await Rental.deleteMany({});
    await User.deleteMany({});
  }

  async pushDataToDb() {
    const user = new User(this.users[0]);
    const user2 = new User(this.users[1]);
    await user.save();
    await user2.save();

    this.rentals.forEach(async rental => {
      const newRental = new Rental(rental);
      newRental.user = user;
      user.rentals.push(newRental);
      await newRental.save();
    });
  }

  async seedDb() {
    await this.cleanDb();
    await this.pushDataToDb();
  }
}

module.exports = FakeDb;