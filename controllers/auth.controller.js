const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/users.model');

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetToken = resetToken;
    user.resetTokenExpiration = Date.now() + 3600000;
    await user.save();
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // const resetLink = `https://main.ddbwdjepg8yrm.amplifyapp.com/reset/${resetToken}`;
    const resetLink =  `${process.env.WEB_URL}/reset/${resetToken}`;
    
    const mailOptions = {
      from: 'usamaaamirsohail@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      html: `
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
          <div style="background-color: #F55D02; padding: 20px;">
            <h2>Password Reset</h2>
            <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
          </div>
        </div>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Password reset link sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while sending the email' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
};
