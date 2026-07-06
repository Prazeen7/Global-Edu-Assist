const mongoose = require('mongoose');

// Define the schema for agents
const AgentSchema = new mongoose.Schema({
    agent_name: {
        type: String,
        required: true,
        unique: true
    },
    head_office: {
        location: { type: String, required: true },
        address: { type: String, required: true },
        tel: { type: String, required: true },
        email: { type: String, required: true },
        web: { type: String, required: true },
        avatar: { type: String, required: true }
    },
    other_locations: [
        {
            location: { type: String, required: true },
            address: { type: String, required: true },
            tel: { type: String, required: true },
            email: { type: String, required: true },
            web: { type: String, required: true }
        }
    ]
});

// Create the model
const AgentModel = mongoose.model('agents', AgentSchema);

module.exports = AgentModel;