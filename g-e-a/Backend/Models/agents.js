const mongoose = require("mongoose")

const AgentSchema = new mongoose.Schema({
    user: {
        type: String,
        default: "agent",
    },
    companyName: {
        type: String,
        required: true,
        trim: true,
    },
    owners: [
        {
            name: {
                type: String,
                required: true,
                trim: true,
            },
            email: {
                type: String,
                trim: true,
                lowercase: true,
            },
        },
    ],
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: [8, "Password must be at least 8 characters long"],
        select: false, 
    },
    website: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true,
    },
    headOfficeAddress: {
        type: String,
        required: true,
        trim: true,
    },
    branches: [
        {
            address: {
                type: String,
                trim: true,
            },
        },
    ],
    profilePicture: {
        url: String,
        filename: String,
        mimetype: String,
        size: Number,
    },
    documents: {
        panVat: {
            url: String,
            filename: String,
            mimetype: String,
            size: Number,
        },
        companyRegistration: {
            url: String,
            filename: String,
            mimetype: String,
            size: Number,
        },
        icanRegistration: {
            url: String,
            filename: String,
            mimetype: String,
            size: Number,
        },
        ownerCitizenship: {
            url: String,
            filename: String,
            mimetype: String,
            size: Number,
        },
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    remarks: {
        type: String,
        trim: true,
    },
    otp: String,
    otpExpiry: Date,
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model("registeredAgent", AgentSchema)
