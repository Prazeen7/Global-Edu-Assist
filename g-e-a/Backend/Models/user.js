const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    user: { type: String, default: "user", required: true },
    otp: { type: String },
    otpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    profilePicture: { type: String, default: null },
    contactNumber: { type: String, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

userSchema.pre("save", function (next) {
    this.updatedAt = Date.now()
    next()
})

const User = mongoose.model("registerusers", userSchema)

module.exports = User
