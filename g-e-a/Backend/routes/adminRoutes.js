const express = require("express")
const router = express.Router()
const verifyToken = require("../middleware/authMiddleware")
const { getAllUsers } = require("../controllers/userController")
const { getAllAgents, updateAgentStatus } = require("../controllers/agentController")
const { getAllAdmins, addAdmin, updateAdmin, removeAdmin } = require("../controllers/superAdminController")
const { getLandingPageContent, updateLandingPageContent } = require("../controllers/landingPageController")

// Log the routes being registered
console.log("Registering admin routes:")
console.log("- /api/admin/users")
console.log("- /api/admin/agents")
console.log("- /api/admin/admins")
console.log("- /api/admin/admins/:adminId")
console.log("- /api/admin/landing-page")

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

// Landing page management routes
router.get("/landing-page", getLandingPageContent)
router.put("/landing-page", updateLandingPageContent)

module.exports = router
