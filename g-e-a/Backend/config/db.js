// Import mongoose for MongoDB
const mongoose = require("mongoose");

// Connect to MongoDB database
const connectDB = async () => {
    try {
        // Connect to local MongoDB with database name 'gea'
        await mongoose.connect("mongodb://127.0.0.1:27017/gea");
        console.log("MongoDB connected");
    } catch (err) {
        // Log error and exit if connection fails
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
};

// Export the connection function
module.exports = connectDB;