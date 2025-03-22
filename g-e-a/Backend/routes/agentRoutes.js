const express = require("express");
const router = express.Router();
const { getAllAgents, createAgent, updateAgent, deleteAgent } = require("../controllers/agentController");

// Get all agents
router.get("/agents", getAllAgents);

// Create a new agent
router.post("/agents", createAgent);

// Update an agent
router.put("/agents/:id", updateAgent);

// Delete an agent
router.delete("/agents/:id", deleteAgent);

module.exports = router;