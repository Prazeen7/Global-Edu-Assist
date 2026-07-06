const mongoose = require("mongoose")

const AdminSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    superAdmin: { type: Boolean, default: false },
    user: { type: String, default: "admin" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

const AdminModel = mongoose.model("admins", AdminSchema)
module.exports = AdminModel
