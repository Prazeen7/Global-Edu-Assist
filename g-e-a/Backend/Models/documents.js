const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    document: { type: String, required: true },
    docs: [{ type: String, required: true }], 
    src: [{ type: String, required: true }],
    info: [{ type: String, required: true }]
});

const docsModel = mongoose.model("documents", UserSchema)
module.exports = docsModel