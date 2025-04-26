const mongoose = require("mongoose")

const chatMessageSchema = new mongoose.Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "senderModel",
        },
        senderModel: {
            type: String,
            required: true,
            enum: ["user", "agent"],
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            refPath: "receiverModel",
        },
        receiverModel: {
            type: String,
            required: true,
            enum: ["user", "agent"],
        },
        content: {
            type: String,
            required: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
        meta: {
            type: String,
            default: null,
        },
    },
    { timestamps: true },
)

const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema)

module.exports = ChatMessage
