const express = require("express");
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const cors = require("cors");
const UserModel = require('./Models/user');
const docsModel = require('./Models/documents');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/gea");

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'np03cs4a220278@heraldcollege.edu.np',
        pass: 'mkak rsmp stzl fyme',
    },
});

// Function to generate a random password
const generatePassword = () => {
    const length = 8;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
};

// Registration endpoint
app.post('/registerUser', (req, res) => {
    const { firstName, lastName, email, password, user = 'u' } = req.body;

    // Check if the email already exists in the database
    UserModel.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({ error: 'Email is already taken' });
            }

            // Create a new user if email is unique
            UserModel.create({ firstName, lastName, email, password, user })
                .then(user => res.json(user))
                .catch(err => {
                    console.log('Error during user creation: ', err);
                    res.status(400).json(err);
                });
        })
        .catch(err => {
            console.log('Error finding existing user: ', err);
            res.status(400).json(err);
        });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                if (existingUser.password === password) {
                    res.json({ message: "Success", firstName: existingUser.firstName, user: existingUser.user });
                } else {
                    res.json({ message: "Password is incorrect" });
                }
            } else {
                res.json({ message: "Please signup first" });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});


// Forgot password endpoint
app.post('/forgot-password', (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email
        UserModel.findOne({ email })
            .then(user => {
                if (!user) {
                    return res.status(400).json({ message: 'Email not found' });
                }

                // Generate a new password
                const newPassword = generatePassword();

                // Update user's password in the database
                user.password = newPassword;
                user.save()
                    .then(() => {
                        // Send the new password to the user's email
                        const mailOptions = {
                            from: 'np03cs4a220278@heraldcollege.edu.np',
                            to: email,
                            subject: 'Your New Password',
                            text: `Your new password is: ${newPassword}`,
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.error(error);
                                return res.status(500).json({ message: 'Failed to send email' });
                            }
                            res.status(200).json({ message: 'Email sent successfully' });
                        });
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).json({ message: 'Error saving new password' });
                    });
            })
            .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Error finding user' });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/documents', (req, res) => {
    docsModel.find()  
        .then(documents => {
            if (documents) {
                res.json(documents);
            } else {
                res.status(404).json({ message: "No document found" });
            }
        })
        .catch(err => {
            console.error("Error fetching document:", err);
            res.status(500).json({ error: "An error occurred while fetching the document" });
        });
});




app.listen(3001, () => {
    console.log("Server is running on port 3001");
});


