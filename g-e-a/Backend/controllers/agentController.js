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

// Create a new agent
exports.createAgent = async (req, res) => {
    const agent = new AgentModel(req.body);
    try {
        const newAgent = await agent.save();
        res.status(201).json(newAgent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update an agent
exports.updateAgent = async (req, res) => {
    try {
        const agent = await AgentModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(agent);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete an agent
exports.deleteAgent = async (req, res) => {
    try {
        await AgentModel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Agent deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};