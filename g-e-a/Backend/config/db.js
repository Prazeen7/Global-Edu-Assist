// Import mongoose for MongoDB
const mongoose = require("mongoose");

require("dotenv").config();

// Connect to MongoDB database
const connectDB = async () => {
    try {
        // Connect to local MongoDB with database name 'gea'
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");
    } catch (err) {
        // Log error and exit if connection fails
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

// Export the connection function
module.exports = connectDB;