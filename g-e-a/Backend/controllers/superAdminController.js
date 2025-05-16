const AdminModel = require("../models/admin")
const bcrypt = require("bcrypt")

// Get all admins
exports.getAllAdmins = async (req, res) => {
    try {
        console.log("Getting all admins")
        const admins = await AdminModel.find({}, { password: 0 }) // Exclude password field
        console.log(`Found ${admins.length} admins`)
        res.status(200).json(admins)
    } catch (error) {
        console.error("Error fetching admins:", error)
        res.status(500).json({ message: "Error fetching admins", error: error.message })
    }
}

// Add a new admin
exports.addAdmin = async (req, res) => {
    try {
        const { firstName, lastName, email, password, superAdmin } = req.body

        // Check if admin already exists
        const existingAdmin = await AdminModel.findOne({ email })
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin with this email already exists" })
        }

        // Validate password
        const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/
        if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({
                message: "Password must be at least 8 characters with 1 uppercase letter and 1 special character (!@#$%^&*)",
            })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create new admin
        const newAdmin = new AdminModel({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            user: "admin",
            superAdmin: superAdmin || false,
        })

        await newAdmin.save()

        // Return admin without password
        const adminResponse = { ...newAdmin.toObject() }
        delete adminResponse.password

        res.status(201).json({ message: "Admin created successfully", admin: adminResponse })
    } catch (error) {
        console.error("Error creating admin:", error)
        res.status(500).json({ message: "Error creating admin", error: error.message })
    }
}

// Update an admin
exports.updateAdmin = async (req, res) => {
    try {
        const { adminId } = req.params
        const { firstName, lastName, email, password, superAdmin } = req.body

        // Check if admin exists
        const admin = await AdminModel.findById(adminId)
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" })
        }

        // Check if email is being changed and if it already exists
        if (email !== admin.email) {
            const existingAdmin = await AdminModel.findOne({ email })
            if (existingAdmin) {
                return res.status(400).json({ message: "Email already in use by another admin" })
            }
        }

        // Update admin fields
        admin.firstName = firstName
        admin.lastName = lastName
        admin.email = email
        admin.superAdmin = superAdmin || false

        // Update password if provided
        if (password) {
            // Validate password
            const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/
            if (!PASSWORD_REGEX.test(password)) {
                return res.status(400).json({
                    message: "Password must be at least 8 characters with 1 uppercase letter and 1 special character (!@#$%^&*)",
                })
            }

            const salt = await bcrypt.genSalt(10)
            admin.password = await bcrypt.hash(password, salt)
        }

        await admin.save()

        // Return admin without password
        const adminResponse = { ...admin.toObject() }
        delete adminResponse.password

        res.status(200).json({ message: "Admin updated successfully", admin: adminResponse })
    } catch (error) {
        console.error("Error updating admin:", error)
        res.status(500).json({ message: "Error updating admin", error: error.message })
    }
}

// Remove an admin
exports.removeAdmin = async (req, res) => {
    try {
        const { adminId } = req.params

        // Check if admin exists
        const admin = await AdminModel.findById(adminId)
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" })
        }

        // Prevent super admin from deleting themselves
        if (admin.superAdmin && admin._id.toString() === req.user.userId) {
            return res.status(400).json({ message: "Cannot delete your own super admin account" })
        }

        await AdminModel.findByIdAndDelete(adminId)
        res.status(200).json({ message: "Admin removed successfully" })
    } catch (error) {
        console.error("Error removing admin:", error)
        res.status(500).json({ message: "Error removing admin", error: error.message })
    }
}
