const AgentModel = require('../models/agent');

// Get all agents
exports.getAllAgents = async (req, res) => {
    try {
        const agents = await AgentModel.find();
        res.json(agents);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
