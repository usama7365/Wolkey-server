const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.header("x-auth-token");

    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    // Remove "Bearer" prefix (with or without space) and trim spaces
    const cleanedToken = token.replace(/^Bearer\s+/i, "").trim();

    const decoded = jwt.verify(cleanedToken, process.env.JWT_SECRET);
    console.log("Original Token:", token);
    console.log("Cleaned Token:", cleanedToken);
    console.log("Secret Key:", process.env.JWT_SECRET);

    req.user = decoded; // Attach the entire decoded payload to req.user
    console.log("Decoded token:", decoded); // Log the decoded token for debugging

    next();
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ error: "Token verification failed" });
  }
};
