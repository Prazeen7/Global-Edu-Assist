const ChatMessage = require("../models/chat")
const User = require("../models/user")
const Agent = require("../models/agents")
const mongoose = require("mongoose")

// Helper function to determine if an ID belongs to a user or agent
const determineUserType = async (id) => {
    try {
        const user = await User.findById(id)
        if (user) return { model: "user", data: user }

        const agent = await Agent.findById(id)
        if (agent) return { model: "agent", data: agent }

        return null
    } catch (error) {
        console.error("Error determining user type:", error)
        return null
    }
}

// Get all chat users for a specific user
exports.getChatUsers = async (req, res) => {
    try {
        const { userId } = req.params

        // Determine if the current user is a user or agent
        const currentUser = await determineUserType(userId)
        if (!currentUser) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        // Find all unique users this user has chatted with
        const sentMessages = await ChatMessage.find({ sender: userId }).distinct("receiver")
        const receivedMessages = await ChatMessage.find({ receiver: userId }).distinct("sender")

        // Combine and remove duplicates
        const chatUserIds = [...new Set([...sentMessages, ...receivedMessages])]

        // Get user details for each chat user
        const chatUsers = []

        for (const id of chatUserIds) {
            // Skip if it's the same user
            if (id.toString() === userId.toString()) continue

            const userType = await determineUserType(id)
            if (!userType) continue

            // Get the last message between these users
            const lastMessage = await ChatMessage.findOne({
                $or: [
                    { sender: userId, receiver: id },
                    { sender: id, receiver: userId },
                ],
            }).sort({ createdAt: -1 })

            // If no messages exist, skip this user
            if (!lastMessage) continue

            // Count unread messages
            const unreadCount = await ChatMessage.countDocuments({
                sender: id,
                receiver: userId,
                read: false,
            })

            // Format the time
            const timeAgo = getTimeAgo(lastMessage.createdAt)

            // Determine if the user is a user or agent and get appropriate data
            const userData = userType.data
            const name =
                userType.model === "user"
                    ? `${userData.firstName || ""} ${userData.lastName || ""}`.trim()
                    : userData.companyName

            const avatar =
                userType.model === "user"
                    ? userData.profilePicture
                    : userData.profilePicture && userData.profilePicture.filename

            chatUsers.push({
                _id: id,
                name,
                avatar,
                lastMessage:
                    lastMessage.content.length > 20 ? lastMessage.content.substring(0, 20) + "..." : lastMessage.content,
                time: timeAgo,
                timestamp: lastMessage.createdAt, 
                hasUnread: unreadCount > 0,
                unreadCount: unreadCount,
                status: "offline", 
                userType: userType.model, 
            })
        }

        return res.status(200).json({
            success: true,
            chatUsers,
            currentUserType: currentUser.model,
        })
    } catch (error) {
        console.error("Error getting chat users:", error)
        return res.status(500).json({
            success: false,
            message: "Server error while getting chat users",
            error: error.message,
        })
    }
}

// Get messages between two users
exports.getMessages = async (req, res) => {
    try {
        const { senderId, receiverId } = req.params

        // Validate IDs
        if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
            return res.status(400).json({ success: false, message: "Invalid user IDs" })
        }

        // Determine the current user's type (user or agent)
        const currentUser = await determineUserType(senderId)
        if (!currentUser) {
            return res.status(404).json({ success: false, message: "Current user not found" })
        }

        // Get messages between these two users
        const messages = await ChatMessage.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ],
        }).sort({ createdAt: 1 })

        // Mark messages as read
        const updatedMessages = await ChatMessage.updateMany(
            { sender: receiverId, receiver: senderId, read: false },
            { $set: { read: true } },
        )

        // Get the io instance
        const io = req.app.get("io")

        if (io && updatedMessages.modifiedCount > 0) {
            console.log(
                `Emitting messages_read event: sender=${receiverId}, receiver=${senderId}, count=${updatedMessages.modifiedCount}`,
            )

            // Emit an event
            io.emit("messages_read", {
                senderId: receiverId,
                receiverId: senderId,
            })

            // emit an event to update the chat list for both users
            io.emit("update_chat_list", { userId: senderId })
            io.emit("update_chat_list", { userId: receiverId })
        }

        // Format messages for frontend
        const formattedMessages = messages.map((msg) => {
            // Determine if the current user is the sender based on ID and model type
            const isSender = msg.sender.toString() === senderId

            return {
                id: msg._id,
                sender: isSender ? "me" : "other",
                content: msg.content,
                time: formatMessageDate(msg.createdAt),
                timestamp: msg.createdAt, 
                meta: msg.meta,
                senderModel: msg.senderModel,
                receiverModel: msg.receiverModel,
                read: msg.read,
            }
        })

        return res.status(200).json({
            success: true,
            messages: formattedMessages,
            currentUserType: currentUser.model,
        })
    } catch (error) {
        console.error("Error getting messages:", error)
        return res.status(500).json({
            success: false,
            message: "Server error while getting messages",
            error: error.message,
        })
    }
}

exports.sendMessage = async (req, res) => {
    try {
        console.log("sendMessage controller called with body:", req.body)
        const { sender, receiver, content } = req.body

        // Log the extracted values
        console.log("Extracted values:", { sender, receiver, content })

        // Validate required fields
        if (!sender || !receiver || !content) {
            console.log("Missing required fields")
            return res.status(400).json({
                success: false,
                message: "Sender, receiver, and content are required",
            })
        }

        // Determine sender and receiver types
        const senderType = await determineUserType(sender)
        const receiverType = await determineUserType(receiver)

        console.log("Sender type:", senderType ? senderType.model : "not found")
        console.log("Receiver type:", receiverType ? receiverType.model : "not found")

        if (!senderType || !receiverType) {
            return res.status(404).json({
                success: false,
                message: "Sender or receiver not found",
            })
        }

        // Create new message
        const newMessage = new ChatMessage({
            sender,
            senderModel: senderType.model,
            receiver,
            receiverModel: receiverType.model,
            content,
            read: false,
        })

        await newMessage.save()
        console.log("Message saved successfully:", newMessage._id)

        // Get the io instance
        const io = req.app.get("io")

        if (io) {
            // Format the message for real-time delivery
            const formattedMessage = {
                id: newMessage._id,
                sender: "other", 
                content: newMessage.content,
                time: formatMessageDate(newMessage.createdAt),
                timestamp: newMessage.createdAt,
                senderModel: newMessage.senderModel,
                receiverModel: newMessage.receiverModel,
                read: newMessage.read,
            }

            // Emit to the receiver's room
            io.to(receiver).emit("newMessage", {
                message: formattedMessage,
                from: {
                    _id: sender,
                    name:
                        senderType.model === "user"
                            ? `${senderType.data.firstName || ""} ${senderType.data.lastName || ""}`.trim()
                            : senderType.data.companyName,
                    userType: senderType.model,
                },
            })

            // Also emit a chat list update event
            io.to(receiver).emit("updateChatList")
        }

        return res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage,
        })
    } catch (error) {
        console.error("Error sending message:", error)
        return res.status(500).json({
            success: false,
            message: "Server error while sending message",
            error: error.message,
        })
    }
}

// Helper function to format date for messages
function formatMessageDate(date) {
    const messageDate = new Date(date)

    // Format: "Apr 10, 2023, 9:16 PM"
    return messageDate.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
    })
}

// Helper function to get time ago for chat list
function getTimeAgo(date) {
    const now = new Date()
    const messageDate = new Date(date)
    const diffMs = now - messageDate
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 60) {
        return `${diffMins}m`
    } else if (diffHours < 24) {
        return `${diffHours}h`
    } else {
        return `${diffDays}d`
    }
}
