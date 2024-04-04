const mongoose = require("mongoose");

// Set up mongoose options to avoid deprecation warnings
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  //   useCreateIndex: false,
  //   useFindAndModify: true,
};

// Create the connection to the database
mongoose.connect(process.env.MONGODB_URI, mongooseOptions);

// Get the default connection
const db = mongoose.connection;

// Event handlers for the database connection
db.on("connected", () => {
  console.log("Connected to the database");
});

db.on("error", (err) => {
  console.error("Database connection error:", err.message);
});

db.on("disconnected", () => {
  console.log("Disconnected from the database");
});

// Export the Mongoose connection object
module.exports = db;
