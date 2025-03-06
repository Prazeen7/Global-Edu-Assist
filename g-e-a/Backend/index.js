const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const documentRoutes = require("./routes/documentRoutes");
const institutionRoutes = require("./routes/institutionRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/gea", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Use Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", documentRoutes);
app.use("/api", institutionRoutes);

// Start Server
app.listen(3001, "0.0.0.0", () => {
    console.log("Server is running on port 3001");
});
