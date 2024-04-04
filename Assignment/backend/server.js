require("dotenv").config();

const db = require("./config/db"); // Import the db.js file
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// Routes
const authRoutes = require("./routes/authRoutes"); // Import the routes.js file

//  Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(process.env.FILE_UPLOAD));

app.use("/api", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`);
});
