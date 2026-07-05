const express = require("express")
const cors = require("cors")
const path = require("path")
const http = require("http")
const socketIo = require("socket.io")
const connectDB = require("./config/db")
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const documentRoutes = require("./routes/documentRoutes")
const institutionRoutes = require("./routes/institutionRoutes")
const agentRoutes = require("./routes/agentRoutes")
const { uploadSingle } = require("./config/multerConfig")
const progressRoutes = require("./routes/progressRoutes")
const chatRoutes = require("./routes/chatRoutes")
const postRoutes = require("./routes/postRoutes")
const adminRoutes = require("./routes/adminRoutes")
const { createInitialSuperAdmin } = require("./controllers/superAdminController")
const mongoose = require("mongoose")

const app = express()
app.use(express.json())

// CORS Configuration
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

// Create HTTP server
const server = http.createServer(app)

// Initialize Socket.io
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true,
    },
})

// Socket.io connection handling
io.on("connection", (socket) => {

    // Track connected users
    let currentUserId = null

    // User joins their own room for private messages
    socket.on("join", (userId) => {
        currentUserId = userId
        socket.join(userId)
        console.log(`User ${userId} joined their room with socket ${socket.id}`)
    })

    // Handle manual read status updates from client
    socket.on("mark_messages_read", (data) => {
        console.log("Manual mark messages read:", data)

        io.emit("messages_read", {
            senderId: data.senderId,
            receiverId: data.receiverId,
        })

        // Also emit chat list update events
        io.emit("update_chat_list", { userId: data.senderId })
        io.emit("update_chat_list", { userId: data.receiverId })
    })

    // Handle disconnect
    socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}, User: ${currentUserId}`)
        currentUserId = null
    })
})

// Make io accessible to our routes
app.set("io", io)

// Serve static files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Use uploadSingle for single file uploads
app.post("/api/upload", uploadSingle, (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" })
    }

    res.status(200).json({
        message: "File uploaded successfully",
        filename: req.file.filename,
    })
})

// Connect to MongoDB
connectDB()

// Use Routes
app.use("/api", authRoutes)
app.use("/api", userRoutes)
app.use("/api", documentRoutes)
app.use("/api", institutionRoutes)
app.use("/api", agentRoutes)
app.use("/api/progress", progressRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/admin", adminRoutes)

const createSuperAdmin = async () => {
    try {
        console.log("🔄 Starting super admin creation...")

        // Import Admin model
        const AdminModel = require("./models/admin")
        const bcrypt = require("bcrypt")

        const adminEmail = "prajin.singh9@gmail.com"
        const adminPassword = "GEA@123456"

        // Check if admin exists
        const existingAdmin = await AdminModel.findOne({ email: adminEmail })
        console.log("🔍 Checking if admin exists:", existingAdmin ? "✅ YES" : "❌ NO")

        if (existingAdmin) {
            console.log("ℹ️ Super admin already exists")
            return
        }

        // Hash password
        console.log("🔐 Hashing password...")
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(adminPassword, salt)

        // Create super admin
        const superAdmin = new AdminModel({
            firstName: "Prajin",
            lastName: "Singh",
            email: adminEmail,
            password: hashedPassword,
            user: "admin",
            superAdmin: true,
        })

        console.log("💾 Saving to database...")
        await superAdmin.save()

        console.log("✅ Super admin created successfully!")
        console.log("📧 Email:", adminEmail)
        console.log("🔑 Password:", adminPassword)

    } catch (error) {
        console.error("❌ Error creating super admin:", error)
    }
}

// Start Server
mongoose.connection.once('open', async () => {
    console.log("✅ MongoDB connection is open and ready")

    // Create super admin
    await createSuperAdmin()
})

// Start server
server.listen(3001, "0.0.0.0", () => {
    console.log("🚀 Server is running on port 3001")
})
