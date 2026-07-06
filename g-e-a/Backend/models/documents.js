const mongoose = require('mongoose');
const { Schema } = mongoose;

const DocumentSchema = new Schema({
    document: { type: String, required: true }, // Title of the document section 
    docs: [{ type: String, required: true }],   // List of required documents
    src: [{ type: String, required: true }],    // Source of each document
    info: [{ type: String, required: true }],   // Additional information about each document
});

// Export the model
module.exports = mongoose.model('documents', DocumentSchema);