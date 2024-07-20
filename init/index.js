// Initialize the database
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/Airbnb";

async function main() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("connected to DB");

    // Initialize database data after successful connection
    await initDB();
    console.log("data was initialized");

    // Close the database connection when done
    await mongoose.connection.close();
    console.log("database connection closed");
  } catch (err) {
    console.log(err);
  }
}

const initDB = async () => {
  try {
    await Listing.deleteMany({}); // Delete all existing data
    initData.data = initData.data.map((obj) => ({...obj , owner: "6691bf78487420cda39264bc"}));
    await Listing.insertMany(initData.data); // Insert new data
  } catch (err) {
    console.log("Error initializing data:", err);
  }
};

main();
