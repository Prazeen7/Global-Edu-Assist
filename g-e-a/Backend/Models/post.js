const mongoose = require("mongoose")

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        content: {
            type: String,
            required: [true, "Content is required"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            enum: ["Study Abroad", "Visa Consulting", "Scholarship", "University Updates", "Immigration News"],
            default: "Study Abroad",
        },
        agent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Agent",
            required: true,
        },
        image: {
            url: String,
            filename: String,
            mimetype: String,
            size: Number,
        },
        likes: {
            type: Number,
            default: 0,
        },
        comments: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true },
)

module.exports = mongoose.model("Post", postSchema)
