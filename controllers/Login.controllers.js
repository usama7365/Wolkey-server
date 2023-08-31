const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/users.model');

exports.PostLoginSchema = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(401).json({ error: "User cannot exist" });
      }
  
      if (!user.isVerified) {
        return res.status(403).json({ error: "Verification email sent to your email. Please verify your account." });
      }
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ error: "Invalid password" }); 
      }
  
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn:60*60*24 *30,
      });
  
      res.status(200).json({ 
       
        _id: user.id,
        token
        
      });
      console.log(res, "response")
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ error: "An error occurred while processing your request" });
    }
};

