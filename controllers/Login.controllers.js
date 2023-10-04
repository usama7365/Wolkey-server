const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

exports.PostLoginSchema = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User does not exist" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        error:
          "Verification email sent to your email. Please verify your account.",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Check if the user is active
    if (!user.isActive) {
      return res.status(403).json({
        error: "Your account is not active. Please contact support for assistance.",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: 60 * 60 * 24 * 30,
    });

    res.status(200).json({
      profileId: user.profileId,
      _id: user._id,
      name: user.displayName,
      email: user.email,
      token,
      role: user.role,
      isVerified: user.isVerified,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (error) {
    console.error("Login Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
};
