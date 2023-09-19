const bcrypt = require('bcrypt');
const User = require('../../models/AdminModels/adminSignup.model');
const nodemailer = require('nodemailer');
const crypto = require('crypto');


exports.PostUserSchema = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already exists' });
        }
        const verificationToken = crypto.randomBytes(20).toString('hex');
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            email,
            password: hashedPassword,
            verificationToken,
            role
        });

        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });


    const verifyLink = `https://main.ddbwdjepg8yrm.amplifyapp.com/verify/${verificationToken}`;


        const mailOptions = {
            from: 'usamaaamirsohail@gmail.com',
            to: email,
            subject: 'Admin Account Verification',

            html: `
            <div style="background-color: #f4f4f4; padding: 20px; text-align: center;">
              <div style="background-color: #F55D02; padding: 20px;">
                <h2>Click the following link to verify Admin account</h2>
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

        res.status(201).json({ message: 'User created successfully check your email to verify your account!' });
    }  catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'An error occurred while creating the user' });
    }
}    

