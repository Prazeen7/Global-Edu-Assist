const AgentModel = require("../models/agents")
const AvailAgent = require("../models/agent")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const emailService = require("../services/emailService") // Make sure this import is added
const util = require("util")

// Set upload directory and create if it doesn't exist
const uploadDir = "uploads"
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        const ext = path.extname(file.originalname)
        cb(null, file.fieldname + "-" + uniqueSuffix + ext)
    },
})

// File filter for allowed types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
    const allowedExtensions = [".jpg", ".jpeg", ".png"]
    const ext = path.extname(file.originalname).toLowerCase()

    if (allowedTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
        cb(null, true)
    } else {
        cb(new Error("Invalid file type. Only JPEG/PNG/JPG allowed"), false)
    }
}

// Create upload middleware for specific document types
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
}).fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "panVat", maxCount: 1 },
    { name: "companyRegistration", maxCount: 1 },
    { name: "icanRegistration", maxCount: 1 },
    { name: "ownerCitizenship", maxCount: 1 },
])

// Create new agent with file uploads
exports.createAgent = async (req, res) => {
    try {
        // Use the upload middleware to handle both profile picture and documents
        upload(req, res, async (err) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    let errorMessage = "File upload error"

                    if (err.code === "LIMIT_FILE_SIZE") {
                        errorMessage = "File size too large. Maximum 5MB allowed"
                    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
                        errorMessage = "Unexpected field in file upload"
                    }

                    return res.status(400).json({ error: errorMessage })
                } else {
                    return res.status(400).json({ error: err.message })
                }
            }

            try {
                const { companyName, email, website, contactNumber, headOfficeAddress, owners, branches, password } = req.body

                // Validate password
                if (!password) {
                    return res.status(400).json({ error: "Password is required" })
                }

                if (password.length < 8) {
                    return res.status(400).json({ error: "Password must be at least 8 characters long" })
                }

                // Hash the password
                const saltRounds = 10
                const hashedPassword = await bcrypt.hash(password, saltRounds)

                // Prepare profile picture data
                let profilePicture = null
                if (req.files && req.files.profilePicture && req.files.profilePicture.length > 0) {
                    const file = req.files.profilePicture[0]
                    profilePicture = {
                        url: `/uploads/${file.filename}`,
                        filename: file.filename,
                        mimetype: file.mimetype,
                        size: file.size,
                    }
                }

                // Prepare documents data
                const documents = {}
                const documentTypes = ["panVat", "companyRegistration", "icanRegistration", "ownerCitizenship"]

                documentTypes.forEach((docType) => {
                    if (req.files && req.files[docType] && req.files[docType].length > 0) {
                        const file = req.files[docType][0]
                        documents[docType] = {
                            url: `/uploads/${file.filename}`,
                            filename: file.filename,
                            mimetype: file.mimetype,
                            size: file.size,
                        }
                    }
                })

                // Create new agent
                const newAgent = new AgentModel({
                    companyName,
                    owners: JSON.parse(owners || "[]"),
                    email,
                    password: hashedPassword, // Store the hashed password
                    website,
                    contactNumber,
                    headOfficeAddress,
                    branches: JSON.parse(branches || "[]"),
                    documents,
                    profilePicture,
                    status: "pending",
                    user: "agent", // Set user type to agent
                })

                const savedAgent = await newAgent.save()

                // Remove password from response
                const agentResponse = savedAgent.toObject()
                delete agentResponse.password

                // Send pending approval email
                try {
                    await emailService.sendAgentPendingEmail(email, companyName)
                } catch (emailError) {
                    console.error("Failed to send pending approval email:", emailError)
                    // Continue even if email fails
                }

                res.status(201).json({
                    success: true,
                    message: "Agent registration submitted successfully",
                    data: agentResponse,
                })
            } catch (error) {
                // Clean up uploaded files if error occurs
                if (req.files) {
                    Object.values(req.files).forEach((fileArray) => {
                        fileArray.forEach((file) => {
                            fs.unlinkSync(path.join("uploads", file.filename))
                        })
                    })
                }
                res.status(400).json({ error: error.message })
            }
        })
    } catch (error) {
        res.status(500).json({ error: "Server error" })
    }
}

// Verify password function (for login)
exports.verifyPassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword)
}

// Get all agents
exports.getAllAgents = async (req, res) => {
    try {
        const agents = await AgentModel.find().select("-otp -otpExpiry")
        res.status(200).json({
            success: true,
            count: agents.length,
            data: agents,
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

exports.availAgent = async (req, res) => {
    try {
        const agents = await AvailAgent.find()
        res.json(agents)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

// Get single agent by ID
exports.getAgentById = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Agent ID is required",
            })
        }

        const agent = await AgentModel.findById(id).select("-password -otp -otpExpiry")

        if (!agent) {
            return res.status(404).json({
                success: false,
                message: "Agent not found",
            })
        }

        // Construct profile picture URL if it exists
        let profilePictureUrl = null
        if (agent.profilePicture && agent.profilePicture.url) {
            // If the URL is already absolute, use it as is
            if (agent.profilePicture.url.startsWith("http")) {
                profilePictureUrl = agent.profilePicture.url
            } else {
                // Otherwise, construct the full URL
                profilePictureUrl = `${req.protocol}://${req.get("host")}${agent.profilePicture.url}`
            }
        }

        // Construct document URLs
        const documents = {}
        if (agent.documents) {
            Object.keys(agent.documents).forEach((docType) => {
                if (agent.documents[docType] && agent.documents[docType].url) {
                    const docUrl = agent.documents[docType].url
                    documents[docType] = {
                        ...agent.documents[docType],
                        url: docUrl.startsWith("http") ? docUrl : `${req.protocol}://${req.get("host")}${docUrl}`,
                    }
                }
            })
        }

        res.status(200).json({
            success: true,
            message: "Agent profile retrieved successfully",
            data: {
                _id: agent._id,
                companyName: agent.companyName,
                email: agent.email,
                website: agent.website,
                contactNumber: agent.contactNumber,
                headOfficeAddress: agent.headOfficeAddress,
                owners: agent.owners,
                branches: agent.branches,
                profilePicture: profilePictureUrl ? { ...agent.profilePicture, url: profilePictureUrl } : null,
                documents: documents,
                status: agent.status,
                remarks: agent.remarks,
                user: agent.user,
                createdAt: agent.createdAt,
                updatedAt: agent.updatedAt,
            },
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}

// Update agent status (approve/reject)
exports.updateAgentStatus = async (req, res) => {
    try {
        const { status, remarks } = req.body

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" })
        }

        const updateData = { status }

        // Add remarks only for rejected status
        if (status === "rejected") {
            if (!remarks || remarks.trim() === "") {
                return res.status(400).json({ error: "Remarks are required when rejecting an agent" })
            }
            updateData.remarks = remarks
        } else {
            // Clear remarks when approving
            updateData.remarks = undefined
        }

        const agent = await AgentModel.findByIdAndUpdate(req.params.id, updateData, { new: true }).select("-otp -otpExpiry")

        if (!agent) {
            return res.status(404).json({ error: "Agent not found" })
        }

        // Send email notification based on status
        try {
            if (status === "approved") {
                await emailService.sendAgentApprovalEmail(agent.email, agent.companyName)
                console.log(`Approval email sent to agent: ${agent.email}`)
            } else if (status === "rejected") {
                await emailService.sendAgentRejectionEmail(agent.email, agent.companyName, remarks, agent._id)
                console.log(`Rejection email sent to agent: ${agent.email}`)
            }
        } catch (emailError) {
            console.error("Failed to send status update email:", emailError)
            // Continue with the response even if email fails
        }

        res.status(200).json({
            success: true,
            message: `Agent ${status} successfully`,
            data: agent,
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Delete agent
exports.deleteAgent = async (req, res) => {
    try {
        const agent = await AgentModel.findByIdAndDelete(req.params.id)
        if (!agent) {
            return res.status(404).json({ error: "Agent not found" })
        }

        // Clean up files
        if (agent.profilePicture && agent.profilePicture.filename) {
            try {
                const profilePath = path.join("uploads", agent.profilePicture.filename)
                if (fs.existsSync(profilePath)) {
                    fs.unlinkSync(profilePath)
                }
            } catch (err) {
                console.error("Error removing profile picture:", err)
                // Continue even if file removal fails
            }
        }

        // Clean up document files
        if (agent.documents) {
            Object.values(agent.documents).forEach((doc) => {
                if (doc && doc.filename) {
                    try {
                        const docPath = path.join("uploads", doc.filename)
                        if (fs.existsSync(docPath)) {
                            fs.unlinkSync(docPath)
                        }
                    } catch (err) {
                        console.error("Error removing document:", err)
                        // Continue even if file removal fails
                    }
                }
            })
        }

        res.status(200).json({
            success: true,
            message: "Agent deleted successfully",
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Generate JWT token for agent
const generateAgentToken = (agent) => {
    const payload = {
        id: agent._id,
        userId: agent._id, // Add userId field for consistency with user tokens
        email: agent.email,
        companyName: agent.companyName,
        role: "agent",
        user: "agent",
    }

    return jwt.sign(
        payload,
        process.env.JWT_SECRET_Agent,
        { expiresIn: "7d" }, // Token expires in 7 days
    )
}

// Login agent - UPDATED to handle different status responses and generate JWT token
exports.loginAgent = async (req, res) => {
    try {
        const { email, password } = req.body

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" })
        }

        // Find agent by email and include password field
        const agent = await AgentModel.findOne({ email }).select("+password")

        if (!agent) {
            return res.status(404).json({ error: "Agent not found" })
        }

        // Check agent status and return appropriate response
        if (agent.status === "pending") {
            return res.status(403).json({
                error: "Your account is not approved yet",
                status: "pending",
            })
        } else if (agent.status === "rejected") {
            return res.status(403).json({
                error: "Your account has been rejected",
                status: "rejected",
                remarks: agent.remarks,
                data: { _id: agent._id },
            })
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, agent.password)

        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid credentials" })
        }

        // Generate JWT token
        const token = generateAgentToken(agent)

        // Remove password from response
        const agentResponse = agent.toObject()
        delete agentResponse.password

        res.status(200).json({
            success: true,
            message: "Login successful",
            token: token,
            data: agentResponse,
        })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

// Update agent profile for resubmission
exports.updateAgentInfo = async (req, res) => {
    try {
        const { id } = req.params
        const { companyName, website, contactNumber, headOfficeAddress, owners, branches } = req.body

        // Log the received data for debugging
        console.log("Received update info request:", {
            id,
            body: req.body,
        })

        // Find the agent to update
        const agent = await AgentModel.findById(id)

        if (!agent) {
            console.error(`Agent not found with ID: ${id}`)
            return res.status(404).json({ error: "Agent not found" })
        }

        // Prepare update data
        const updateData = {
            companyName,
            website,
            contactNumber,
            headOfficeAddress,
            status: "pending", // Reset status to pending
            remarks: undefined, // Clear previous remarks
            updatedAt: new Date(),
        }

        // Parse JSON strings for arrays
        try {
            if (owners) {
                updateData.owners = typeof owners === "string" ? JSON.parse(owners) : owners
            }
        } catch (e) {
            console.error("Error parsing owners:", e)
            // If parsing fails, use the original owners from the agent
            updateData.owners = agent.owners || []
        }

        try {
            if (branches) {
                updateData.branches = typeof branches === "string" ? JSON.parse(branches) : branches
            }
        } catch (e) {
            console.error("Error parsing branches:", e)
            // If parsing fails, use the original branches from the agent
            updateData.branches = agent.branches || []
        }

        // Update the agent
        const updatedAgent = await AgentModel.findByIdAndUpdate(id, updateData, { new: true }).select(
            "-password -otp -otpExpiry",
        )

        if (!updatedAgent) {
            console.error(`Failed to update agent with ID: ${id}`)
            return res.status(500).json({ error: "Failed to update agent" })
        }

        res.status(200).json({
            success: true,
            message: "Agent information updated successfully",
            data: updatedAgent,
        })
    } catch (error) {
        console.error("Error in updateAgentInfo:", error)
        res.status(500).json({ error: error.message })
    }
}

exports.updateAgentProfile = async (req, res) => {
    try {
        // Debug information
        console.log("Update agent profile request received:")
        console.log("Request body:", req.body)
        console.log(
            "Request files:",
            req.files ? Object.keys(req.files).map((key) => `${key}: ${req.files[key].length} files`) : "No files",
        )
        console.log("Request headers:", req.headers)

        // Use the upload middleware to handle both profile picture and documents
        upload(req, res, async (err) => {
            if (err) {
                console.error("Multer error:", err)

                if (err instanceof multer.MulterError) {
                    let errorMessage = "File upload error"

                    if (err.code === "LIMIT_FILE_SIZE") {
                        errorMessage = "File size too large. Maximum 5MB allowed"
                    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
                        errorMessage = "Unexpected field in file upload"
                    }

                    return res.status(400).json({ error: errorMessage, details: err.toString() })
                } else {
                    return res.status(400).json({ error: err.message, details: err.toString() })
                }
            }

            try {
                const { id } = req.params
                console.log(`Processing update for agent ID: ${id}`)

                // Log the parsed body
                console.log("Parsed request body:", req.body)

                const { companyName, email, website, contactNumber, headOfficeAddress, owners, branches, keepExistingFiles } =
                    req.body

                // Find the agent to update
                const agent = await AgentModel.findById(id)

                if (!agent) {
                    console.error(`Agent not found with ID: ${id}`)
                    return res.status(404).json({ error: "Agent not found" })
                }

                // Prepare update data
                const updateData = {
                    companyName,
                    email,
                    website,
                    contactNumber,
                    headOfficeAddress,
                    status: "pending", // Reset status to pending
                    remarks: undefined, // Clear previous remarks
                    updatedAt: new Date(),
                }

                // Parse JSON strings for arrays
                try {
                    if (owners) {
                        updateData.owners = JSON.parse(owners)
                        console.log("Parsed owners:", updateData.owners)
                    }
                } catch (e) {
                    console.error("Error parsing owners:", e)
                    // If parsing fails, use the original owners from the agent
                    updateData.owners = agent.owners || []
                }

                try {
                    if (branches) {
                        updateData.branches = JSON.parse(branches)
                        console.log("Parsed branches:", updateData.branches)
                    }
                } catch (e) {
                    console.error("Error parsing branches:", e)
                    // If parsing fails, use the original branches from the agent
                    updateData.branches = agent.branches || []
                }

                // Handle profile picture update if provided
                if (req.files && req.files.profilePicture && req.files.profilePicture.length > 0) {
                    const file = req.files.profilePicture[0]
                    console.log("Processing profile picture:", file.filename)

                    // Delete old profile picture if it exists
                    if (agent.profilePicture && agent.profilePicture.filename) {
                        try {
                            const oldFilePath = path.join("uploads", agent.profilePicture.filename)
                            if (fs.existsSync(oldFilePath)) {
                                fs.unlinkSync(oldFilePath)
                                console.log(`Deleted old profile picture: ${oldFilePath}`)
                            }
                        } catch (err) {
                            console.error("Error removing old profile picture:", err)
                            // Continue even if old file removal fails
                        }
                    }

                    updateData.profilePicture = {
                        url: `/uploads/${file.filename}`,
                        filename: file.filename,
                        mimetype: file.mimetype,
                        size: file.size,
                    }
                } else if (keepExistingFiles === "true" && agent.profilePicture) {
                    // Keep existing profile picture
                    console.log("Keeping existing profile picture")
                    updateData.profilePicture = agent.profilePicture
                }

                // Handle document updates if provided
                const documentTypes = ["panVat", "companyRegistration", "icanRegistration", "ownerCitizenship"]
                const documents = { ...agent.documents } || {}

                documentTypes.forEach((docType) => {
                    if (req.files && req.files[docType] && req.files[docType].length > 0) {
                        const file = req.files[docType][0]
                        console.log(`Processing document ${docType}:`, file.filename)

                        // Delete old document if it exists
                        if (documents[docType] && documents[docType].filename) {
                            try {
                                const oldFilePath = path.join("uploads", documents[docType].filename)
                                if (fs.existsSync(oldFilePath)) {
                                    fs.unlinkSync(oldFilePath)
                                    console.log(`Deleted old document ${docType}: ${oldFilePath}`)
                                }
                            } catch (err) {
                                console.error(`Error removing old ${docType} document:`, err)
                                // Continue even if old file removal fails
                            }
                        }

                        documents[docType] = {
                            url: `/uploads/${file.filename}`,
                            filename: file.filename,
                            mimetype: file.mimetype,
                            size: file.size,
                        }
                    } else if (keepExistingFiles === "true" && documents[docType]) {
                        // Keep existing document
                        console.log(`Keeping existing document: ${docType}`)
                    }
                })

                updateData.documents = documents

                // Update the agent
                const updatedAgent = await AgentModel.findByIdAndUpdate(id, updateData, { new: true }).select(
                    "-password -otp -otpExpiry",
                )

                if (!updatedAgent) {
                    console.error(`Failed to update agent with ID: ${id}`)
                    return res.status(500).json({ error: "Failed to update agent" })
                }

                // Send notification to admin about resubmission
                try {
                    await emailService.sendAgentResubmissionNotificationToAdmin(updatedAgent.companyName, updatedAgent._id)
                    console.log(`Resubmission notification sent to admin for agent: ${updatedAgent.companyName}`)
                } catch (emailError) {
                    console.error("Failed to send resubmission notification:", emailError)
                    // Continue even if email fails
                }

                // Construct profile picture URL if it exists
                let profilePictureUrl = null
                if (updatedAgent.profilePicture && updatedAgent.profilePicture.url) {
                    // If the URL is already absolute, use it as is
                    if (updatedAgent.profilePicture.url.startsWith("http")) {
                        profilePictureUrl = updatedAgent.profilePicture.url
                    } else {
                        // Otherwise, construct the full URL
                        profilePictureUrl = `${req.protocol}://${req.get("host")}${updatedAgent.profilePicture.url}`
                    }
                }

                // Construct document URLs
                const documentUrls = {}
                if (updatedAgent.documents) {
                    Object.keys(updatedAgent.documents).forEach((docType) => {
                        if (updatedAgent.documents[docType] && updatedAgent.documents[docType].url) {
                            const docUrl = updatedAgent.documents[docType].url
                            documentUrls[docType] = {
                                ...updatedAgent.documents[docType],
                                url: docUrl.startsWith("http") ? docUrl : `${req.protocol}://${req.get("host")}${docUrl}`,
                            }
                        }
                    })
                }

                console.log("Agent updated successfully")

                res.status(200).json({
                    success: true,
                    message: "Agent information resubmitted successfully",
                    data: {
                        ...updatedAgent.toObject(),
                        profilePicture: profilePictureUrl ? { ...updatedAgent.profilePicture, url: profilePictureUrl } : null,
                        documents: documentUrls,
                    },
                })
            } catch (error) {
                console.error("Error in updateAgentProfile:", error)

                // Clean up uploaded files if error occurs
                if (req.files) {
                    Object.values(req.files).forEach((fileArray) => {
                        fileArray.forEach((file) => {
                            try {
                                fs.unlinkSync(path.join("uploads", file.filename))
                                console.log(`Cleaned up file after error: ${file.filename}`)
                            } catch (err) {
                                console.error("Error removing file after error:", err)
                            }
                        })
                    })
                }

                res.status(400).json({
                    error: error.message,
                    stack: error.stack,
                    details: "An error occurred while processing your request",
                })
            }
        })
    } catch (error) {
        console.error("Server error in updateAgentProfile:", error)
        res.status(500).json({
            error: "Server error",
            message: error.message,
            stack: error.stack,
        })
    }
}

// Add these new functions to your agentController.js file

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
    try {
        const { id } = req.params
        console.log(`Processing profile picture upload for agent ID: ${id}`)

        // Check if file was uploaded
        if (!req.file) {
            console.log("No profile picture file received")
            return res.status(400).json({ error: "No profile picture file received" })
        }

        console.log("Profile picture file received:", req.file)

        // Find the agent to update
        const agent = await AgentModel.findById(id)
        if (!agent) {
            console.error(`Agent not found with ID: ${id}`)
            return res.status(404).json({ error: "Agent not found" })
        }

        // Delete old profile picture if it exists
        if (agent.profilePicture && agent.profilePicture.filename) {
            try {
                const oldFilePath = path.join("uploads", agent.profilePicture.filename)
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath)
                    console.log(`Deleted old profile picture: ${oldFilePath}`)
                }
            } catch (err) {
                console.error("Error removing old profile picture:", err)
                // Continue even if old file removal fails
            }
        }

        // Update profile picture
        const profilePicture = {
            url: `/uploads/${req.file.filename}`,
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size,
        }

        // Update the agent
        const updatedAgent = await AgentModel.findByIdAndUpdate(
            id,
            {
                profilePicture,
                status: "pending", // Reset status to pending
                updatedAt: new Date(),
            },
            { new: true },
        ).select("-password -otp -otpExpiry")

        if (!updatedAgent) {
            console.error(`Failed to update agent with ID: ${id}`)
            return res.status(500).json({ error: "Failed to update agent" })
        }

        // Construct profile picture URL
        const profilePictureUrl = `${req.protocol}://${req.get("host")}${profilePicture.url}`

        res.status(200).json({
            success: true,
            message: "Profile picture uploaded successfully",
            data: {
                profilePicture: { ...profilePicture, url: profilePictureUrl },
            },
        })
    } catch (error) {
        console.error("Error in uploadProfilePicture:", error)
        res.status(500).json({
            error: "Server error",
            message: error.message,
            stack: error.stack,
        })
    }
}

// Upload document
exports.uploadDocument = async (req, res) => {
    try {
        const { id } = req.params
        const { documentType } = req.body

        console.log(`Processing document upload for agent ID: ${id}, document type: ${documentType}`)

        // Check if file was uploaded
        if (!req.file) {
            console.log("No document file received")
            return res.status(400).json({ error: "No document file received" })
        }

        // Check if document type is valid
        if (
            !documentType ||
            !["panVat", "companyRegistration", "icanRegistration", "ownerCitizenship"].includes(documentType)
        ) {
            console.log("Invalid document type:", documentType)
            return res.status(400).json({ error: "Invalid document type" })
        }

        console.log("Document file received:", req.file)

        // Find the agent to update
        const agent = await AgentModel.findById(id)
        if (!agent) {
            console.error(`Agent not found with ID: ${id}`)
            return res.status(404).json({ error: "Agent not found" })
        }

        // Delete old document if it exists
        if (agent.documents && agent.documents[documentType] && agent.documents[documentType].filename) {
            try {
                const oldFilePath = path.join("uploads", agent.documents[documentType].filename)
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath)
                    console.log(`Deleted old document ${documentType}: ${oldFilePath}`)
                }
            } catch (err) {
                console.error(`Error removing old ${documentType} document:`, err)
                // Continue even if old file removal fails
            }
        }

        // Create document object
        const document = {
            url: `/uploads/${req.file.filename}`,
            filename: req.file.filename,
            mimetype: req.file.mimetype,
            size: req.file.size,
        }

        // Update the agent's documents
        const documents = { ...(agent.documents || {}) }
        documents[documentType] = document

        // Update the agent
        const updatedAgent = await AgentModel.findByIdAndUpdate(
            id,
            {
                documents,
                status: "pending", // Reset status to pending
                updatedAt: new Date(),
            },
            { new: true },
        ).select("-password -otp -otpExpiry")

        if (!updatedAgent) {
            console.error(`Failed to update agent with ID: ${id}`)
            return res.status(500).json({ error: "Failed to update agent" })
        }

        // Construct document URL
        const documentUrl = `${req.protocol}://${req.get("host")}${document.url}`

        res.status(200).json({
            success: true,
            message: `Document ${documentType} uploaded successfully`,
            data: {
                documentType,
                document: { ...document, url: documentUrl },
            },
        })
    } catch (error) {
        console.error("Error in uploadDocument:", error)
        res.status(500).json({
            error: "Server error",
            message: error.message,
            stack: error.stack,
        })
    }
}
