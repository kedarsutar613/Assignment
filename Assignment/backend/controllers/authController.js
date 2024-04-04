const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library

// Controller function for user registration
exports.registerUser = asyncHandler(async (req, res) => {
  const { password, email, name, dateOfBirth } = req.body;

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new User({
      email,
      password,
      name,
      dateOfBirth,
    });

    const user = await newUser.save();

    // Here, you can implement JWT or session-based authentication to generate a token or set a session
    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000, // Cookie will expire in 1 hour (1h * 60min * 60s * 1000ms)
      secure: true, // Set this to true in a production environment with HTTPS enabled
      sameSite: "strict", // Adjust the value based on your application's requirements
    });

    res
      .status(200)
      .json({ message: "User logged in successfully", user: user, token });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to register user", error: err.message });
  }
});

// Controller function for user login
exports.loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ email: username }, { contact_number: username }],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await user.matchPasswords(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Here, you can implement JWT or session-based authentication to generate a token or set a session
    // Generate a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 3600000, // Cookie will expire in 1 hour (1h * 60min * 60s * 1000ms)
      // secure: true, // Set this to true in a production environment with HTTPS enabled
      sameSite: "strict", // Adjust the value based on your application's requirements
    });

    res
      .status(200)
      .json({ message: "User logged in successfully", user: user, token });
  } catch (err) {
    res.status(500).json({ message: "Failed to log in", error: err.message });
  }
});

exports.signout = (req, res) => {
  res.clearCookie("token");
  res.json({
    message: "User signout successfully",
  });
};
