const User = require('../models/users.model');

exports.verifyAccount = async (req, res) => {
  const token = req.params.token;

  try {
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      console.log('User not found for token:', token);
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    if (user.isVerified) {
      console.log('User is already verified:', user.email);
      return res.status(400).json({ error: 'Account is already verified' });
    }

    user.verificationToken = undefined;
    user.isVerified = true;
    await user.save();

    console.log('Account verified:', user.email);
    return res.status(200).json({ message: 'Account verified successfully' });
  } catch (error) {
    console.error('Error verifying account:', error);
    return res.status(500).json({ error: 'An error occurred while verifying the account' });
  }
};
