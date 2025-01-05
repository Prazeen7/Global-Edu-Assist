const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const UserModel = require('./Models/user'); 

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://127.0.0.1:27017/gea");

app.post('')

// Registration endpoint
app.post('/registerUser', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Check if the email already exists in the database
    UserModel.findOne({ email })
        .then(existingUser => {
            if (existingUser) {
                return res.status(400).json({ error: 'Email is already taken' });
            }

            // Create a new user if email is unique
            UserModel.create({ firstName, lastName, email, password })
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

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
