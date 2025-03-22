const UserModel = require("../models/user");

// Register a new user
const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, user = "u" } = req.body;

    try {
        // Check if the email is already taken
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email is already taken" });
        }

        // Create a new user
        const newUser = await UserModel.create({ firstName, lastName, email, password, user });
        res.status(201).json(newUser); // Return the newly created user
    } catch (err) {
        res.status(400).json({ error: err.message }); // Handle errors
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    try {
        // Fetch all users from the database
        const users = await UserModel.find({});
        res.status(200).json(users); // Return the list of users
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users" }); // Handle errors
    }
};

module.exports = { registerUser, getAllUsers };