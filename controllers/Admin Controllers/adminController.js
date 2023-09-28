const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const Admin = require('../../models/AdminModels/adminSignup.model');

exports.AdminSignup = async (req, res) => {
  const { email, password,name,  role } = req.body;

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const verificationToken = crypto.randomBytes(20).toString('hex');
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      email,
      password: hashedPassword,
      verificationToken,
      role,
      name
    });

    await admin.save();

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verifyLink = `http://localhost:5000/admin/verify/${verificationToken}`;

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Admin Account Verification',
      html: `
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
          <div style="background-color: #F55D02; padding: 20px;">
            <h2>Click the following link to verify your Admin account</h2>
            <p>Click <a href="${verifyLink}">here</a> to verify your account.</p>
          </div>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending verification email:', error);
      } else {
        console.log('Verification email sent:', info.response);
      }
    });

    res.status(201).json({
      message: 'Admin created successfully. Check your email to verify your account!',
    });
  } catch (error) {
    console.error('Error creating admin:', error);
    res.status(500).json({ error: 'An error occurred while creating the admin' });
  }
};

exports.AdminLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ error: 'Admin does not exist' });
    }

    if (!admin.isVerified) {
      return res.status(403).json({
        error: 'Verification email sent to your email. Please verify your Admin account.',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res.status(200).json({

      message: 'Login successful',
      role: admin.role,
      name: admin.name,
      email: admin.email,
      token,
      isVerified: admin.isVerified,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};

exports.AdminverifyAccount = async (req, res) => {
  const token = req.params.token;

  try {
    const admin = await Admin.findOne({ verificationToken: token });
    if (!admin) {
      console.log('Admin not found for token:', token);
      return res.status(400).json({ error: 'Invalid verification token' });
    }

    if (admin.isVerified) {
      console.log('Admin is already verified:', admin.email);
      return res.status(400).json({ error: 'Account is already verified' });
    }

    admin.verificationToken = undefined;
    admin.isVerified = true;
    await admin.save();

    console.log('Account verified:', admin.email);
    return res.status(200).json({ message: 'Account verified successfully' });
  } catch (error) {
    console.error('Error verifying account:', error);
    return res.status(500).json({ error: 'An error occurred while verifying the account' });
  }
};
