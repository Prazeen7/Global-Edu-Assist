const mongoose = require('mongoose')

const DocumentsSchema = new mongoose.Schema({
    document: { type: String, required: true },
    docs: [{ type: String, required: true }], 
    src: [{ type: String, required: true }],
    info: [{ type: String, required: true }]
});

const docsModel = mongoose.model("documents", DocumentsSchema)
module.exports = docsModel