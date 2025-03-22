const express = require("express");
const cors = require("cors");
const path = require("path"); // Import the path module
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const documentRoutes = require("./routes/documentRoutes");
const institutionRoutes = require("./routes/institutionRoutes");
const programRoutes = require("./routes/programRoutes");
const agentRoutes = require("./routes/agentRoutes");

const app = express();
app.use(express.json());

// CORS Configuration
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Serve static files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
connectDB();

// Use Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", documentRoutes);
app.use("/api", institutionRoutes);
app.use("/api", programRoutes);
app.use("/api", agentRoutes);

// Start Server
app.listen(3001, "0.0.0.0", () => {
    console.log("Server is running on port 3001");
});