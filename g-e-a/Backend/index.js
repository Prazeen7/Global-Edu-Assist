    const express = require("express");
    const cors = require("cors");
    const connectDB = require("./config/db");

    const authRoutes = require("./routes/authRoutes");
    const userRoutes = require("./routes/userRoutes");
    const documentRoutes = require("./routes/documentRoutes");
    const institutionRoutes = require("./routes/institutionRoutes");
    const programRoutes = require("./routes/programRoutes");

    const app = express();
    app.use(express.json());
    app.use(cors());

    // Connect to MongoDB
    connectDB();

    // Use Routes
    app.use("/api", authRoutes);
    app.use("/api", userRoutes);
    app.use("/api", documentRoutes);
    app.use("/api", institutionRoutes);
    app.use("/api", programRoutes);

    // Start Server
    app.listen(3001, "0.0.0.0", () => {
        console.log("Server is running on port 3001");
    });