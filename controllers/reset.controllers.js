const bcrypt = require('bcrypt');
const User = require('../models/users.model');

exports.showResetForm = (req, res) => {
  // Render the reset password form in your frontend
  // You can use the data in req.userData to identify the user
  // For example, you might render an HTML form for resetting the password
  // and send it as a response.
  res.status(200).send(`
    <html>
      <head>
        <title>Password Reset</title>
      </head>
      <body>
        <h2>Reset Your Password</h2>
        <form action="/reset/reset-password/${req.params.token}" method="POST">
          <label for="newPassword">New Password:</label>
          <input type="password" id="newPassword" name="newPassword" required><br><br>
          <button type="submit">Reset Password</button>
        </form>
      </body>
    </html>
  `);
};

exports.resetPassword = async (req, res) => {
  const { newPassword } = req.body;
  const resetToken = req.params.token; // Extract reset token from URL

  try {
    // Find the user by resetToken
    const user = await User.findOne({ resetToken });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if resetToken is still valid
    if (user.resetTokenExpiration <= Date.now()) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password and reset token in the database
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while resetting the password' });
  }
};
