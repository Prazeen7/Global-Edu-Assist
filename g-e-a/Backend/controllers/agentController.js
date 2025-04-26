const AgentModel = require("../models/agents")
const AvailAgent = require("../models/agent")
const multer = require("multer")
const path = require("path")
const fs = require("fs")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken") // Add JWT import

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
        if (agent.profilePicture) {
            fs.unlinkSync(path.join("uploads", agent.profilePicture.filename))
        }

        // Clean up document files
        if (agent.documents) {
            Object.values(agent.documents).forEach((doc) => {
                if (doc && doc.filename) {
                    fs.unlinkSync(path.join("uploads", doc.filename))
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

// Get agent profile by ID (no JWT required)
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

// Add this function to your existing agentController.js file

// Update agent profile
exports.updateAgentProfile = async (req, res) => {
    try {
        const { id } = req.params

        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Agent ID is required",
            })
        }

        // Get the agent to update
        const agent = await AgentModel.findById(id)

        if (!agent) {
            return res.status(404).json({
                success: false,
                message: "Agent not found",
            })
        }

        // Extract fields from request body
        const { companyName, email, website, contactNumber, headOfficeAddress } = req.body

        // Parse JSON strings for arrays
        let owners = []
        let branches = []

        try {
            if (req.body.owners) {
                // Parse the JSON string to get the actual array
                const parsedOwners = JSON.parse(req.body.owners)
                // Ensure it's an array
                owners = Array.isArray(parsedOwners) ? parsedOwners : []
            }
        } catch (e) {
            console.error("Error parsing owners:", e)
            // If parsing fails, use the original owners from the agent
            owners = agent.owners || []
        }

        try {
            if (req.body.branches) {
                // Parse the JSON string to get the actual array
                const parsedBranches = JSON.parse(req.body.branches)
                // Ensure it's an array
                branches = Array.isArray(parsedBranches) ? parsedBranches : []
            }
        } catch (e) {
            console.error("Error parsing branches:", e)
            // If parsing fails, use the original branches from the agent
            branches = agent.branches || []
        }

        // Update agent fields
        const updateData = {
            companyName,
            email,
            website,
            contactNumber,
            headOfficeAddress,
            updatedAt: new Date(),
        }

        // Only update arrays if they were successfully parsed
        if (owners.length > 0 || agent.owners.length === 0) {
            updateData.owners = owners
        }

        if (branches.length > 0 || agent.branches.length === 0) {
            updateData.branches = branches
        }

        // Handle profile picture upload if present
        if (req.file) {
            // Create uploads directory if it doesn't exist
            const uploadDir = "uploads"
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true })
            }

            // Remove old profile picture file if it exists
            if (agent.profilePicture && agent.profilePicture.filename) {
                try {
                    const oldFilePath = path.join("uploads", agent.profilePicture.filename)
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath)
                    }
                } catch (err) {
                    console.error("Error removing old profile picture:", err)
                    // Continue even if old file removal fails
                }
            }

            // Add new profile picture
            updateData.profilePicture = {
                url: `/uploads/${req.file.filename}`,
                filename: req.file.filename,
                mimetype: req.file.mimetype,
                size: req.file.size,
            }
        }

        console.log("Update data:", JSON.stringify(updateData, null, 2))

        // Use updateOne instead of findByIdAndUpdate to avoid schema validation issues
        const result = await AgentModel.updateOne({ _id: id }, { $set: updateData })

        if (result.modifiedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Failed to update agent",
            })
        }

        // Get the updated agent
        const updatedAgent = await AgentModel.findById(id).select("-password -otp -otpExpiry")

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

        // Prepare response data
        const responseData = {
            ...updatedAgent.toObject(),
            profilePicture: updatedAgent.profilePicture ? { ...updatedAgent.profilePicture, url: profilePictureUrl } : null,
        }

        res.status(200).json({
            success: true,
            message: "Agent profile updated successfully",
            data: responseData,
        })
    } catch (error) {
        console.error("Error updating agent profile:", error)
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message,
        })
    }
}
