const express = require("express")
const router = express.Router()
const verifyToken = require("../middleware/authMiddleware")
const { getAllUsers } = require("../controllers/userController")
const { getAllAgents, updateAgentStatus } = require("../controllers/agentController")
const { getAllAdmins, addAdmin, updateAdmin, removeAdmin } = require("../controllers/superAdminController")

// All routes in this file require admin authentication
router.use(verifyToken)
router.use(verifyToken.isAdmin)

// Admin user management routes
router.get("/users", getAllUsers)

// Admin agent management routes
router.get("/agents", getAllAgents)
router.put("/agent/:id/status", updateAgentStatus)

// Super Admin routes - only accessible by super admins
router.get("/admins", verifyToken.isSuperAdmin, getAllAdmins)
router.post("/admins", verifyToken.isSuperAdmin, addAdmin)
router.put("/admins/:adminId", verifyToken.isSuperAdmin, updateAdmin)
router.delete("/admins/:adminId", verifyToken.isSuperAdmin, removeAdmin)

module.exports = router
