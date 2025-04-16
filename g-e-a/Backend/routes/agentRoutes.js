const express = require("express");
const router = express.Router();
const { getAllAgents, createAgent, updateAgent, deleteAgent } = require("../controllers/agentController");

// Get all agents
router.get("/agents", getAllAgents);

module.exports = router;