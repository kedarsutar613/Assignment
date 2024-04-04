const express = require("express");
const {
  registerUser,
  loginUser,
  signout,
} = require("../controllers/authController");

const router = express.Router();

// Route for user registration with parameter validation
router.post("/register", registerUser);

// Route for user login with parameter validation
router.post("/login", loginUser);

// logout routes
router.get("/logout", signout);

module.exports = router;
