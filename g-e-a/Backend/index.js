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
const programRoutes = require("./routes/programRoutes")
const agentRoutes = require("./routes/agentRoutes")
const { uploadSingle } = require("./config/multerConfig")
const progressRoutes = require("./routes/progressRoutes")
const chatRoutes = require("./routes/chatRoutes")

const app = express()
app.use(express.json())

// CORS Configuration
const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

// Create HTTP server
const server = http.createServer(app)

// Initialize Socket.io
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true,
    },
})

// Socket.io connection handling
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id)

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

        // Emit to all clients that messages have been read
        // Make sure to include both senderId and receiverId for proper client-side handling
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
app.use("/api", programRoutes)
app.use("/api", agentRoutes)
app.use("/api/progress", progressRoutes)
app.use("/api/chat", chatRoutes)

// Start Server
server.listen(3001, "0.0.0.0", () => {
    console.log("Server is running on port 3001")
})
