"use client"

import { useState, useEffect, useCallback, useContext, useRef } from "react"
import axios from "axios"
import { AuthContext } from "../Context/context"
import io from "socket.io-client"
import {
    Badge,
    Avatar,
    Menu,
    IconButton,
    TextField,
    Dialog,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Paper,
    InputAdornment,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
    Chip,
    alpha,
    createTheme,
    ThemeProvider,
    Zoom,
} from "@mui/material"
import {
    Message as MessageIcon,
    Close as CloseIcon,
    Search as SearchIcon,
    Send as SendIcon,
    MoreVert as MoreVertIcon,
    Notifications as NotificationsIcon,
} from "@mui/icons-material"

// Base URL for API requests
const API_BASE_URL = "http://localhost:3001"
const SOCKET_URL = "http://localhost:3001"

// Function to decode JWT token
const parseJwt = (token) => {
    try {
        const base64Url = token.split(".")[1]
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/")
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join(""),
        )
        return JSON.parse(jsonPayload)
    } catch (error) {
        console.error("Error parsing JWT token:", error)
        return null
    }
}

// Helper function to get time ago for chat list
const getTimeAgo = (date) => {
    if (!date) return ""

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

const ChatSystem = () => {
    // Create a custom theme with the brand color
    const customTheme = createTheme({
        palette: {
            primary: {
                main: "#4f46e5",
                light: "#6366f1",
                dark: "#4338ca",
            },
        },
    })

    const [showChatBox, setShowChatBox] = useState(false)
    const [activeChatUser, setActiveChatUser] = useState(null)
    const [anchorEl, setAnchorEl] = useState(null)
    const [message, setMessage] = useState("")
    const [chatUsers, setChatUsers] = useState([])
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [currentUserId, setCurrentUserId] = useState("")
    const [currentUserName, setCurrentUserName] = useState("")
    const [currentUserType, setCurrentUserType] = useState("user") // Default to "user"
    const [currentReceiverId, setCurrentReceiverId] = useState("")
    const [currentReceiverType, setCurrentReceiverType] = useState("") // "user" or "agent"
    const [searchTerm, setSearchTerm] = useState("")
    const [pendingAgent, setPendingAgent] = useState(null)
    const [socket, setSocket] = useState(null)
    const [notification, setNotification] = useState(null)
    const [showNotification, setShowNotification] = useState(false)
    const [totalUnreadMessages, setTotalUnreadMessages] = useState(0)
    const [isScrollLocked, setIsScrollLocked] = useState(false) // Add scroll lock state

    const messagesEndRef = useRef(null)
    const dialogContentRef = useRef(null)
    const open = Boolean(anchorEl)

    // Refs to track state without causing re-renders
    const chatUpdateTimeoutRef = useRef(null)
    const lastFetchTimeRef = useRef(0)
    const scrollTimeoutRef = useRef(null)
    const currentReceiverIdRef = useRef("")
    const chatOpenedRef = useRef(false)
    const messagesLoadedRef = useRef(false)
    const activeDialogIdRef = useRef(null) // Add a ref to track the active dialog

    // Initialize socket connection
    useEffect(() => {
        const newSocket = io(SOCKET_URL)
        setSocket(newSocket)

        // Clean up on unmount
        return () => {
            newSocket.disconnect()

            // Clear any pending timeouts
            if (chatUpdateTimeoutRef.current) {
                clearTimeout(chatUpdateTimeoutRef.current)
            }
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current)
            }
        }
    }, [])

    // Update currentReceiverId ref when the state changes
    useEffect(() => {
        currentReceiverIdRef.current = currentReceiverId
    }, [currentReceiverId])

    // Set up a timer to refresh time ago indicators every minute
    useEffect(() => {
        const timeAgoInterval = setInterval(() => {
            // Update chat users with new time ago values without causing a full re-render
            setChatUsers((prevUsers) =>
                prevUsers.map((user) => ({
                    ...user,
                    time: user.lastMessageTime ? getTimeAgo(user.lastMessageTime) : user.time,
                })),
            )
        }, 60000) // Update every minute

        return () => clearInterval(timeAgoInterval)
    }, [])

    // Join user's room when userId is available
    useEffect(() => {
        if (socket && currentUserId) {
            socket.emit("join", currentUserId)
            console.log(`User ${currentUserId} joined their room with socket ${socket.id}`)

            // Listen for new messages
            socket.on("newMessage", (data) => {
                console.log("New message received:", data)

                // If chat is open with the sender, add message to chat
                if (showChatBox && currentReceiverIdRef.current === data.from._id) {
                    // Update messages in a single operation to prevent flickering
                    setMessages((prevMessages) => [...prevMessages, data.message])

                    // Only scroll if we're not scroll-locked
                    if (!isScrollLocked) {
                        // Use multiple scroll attempts to ensure it works
                        const scrollToBottom = () => {
                            if (dialogContentRef.current && activeDialogIdRef.current === data.from._id) {
                                dialogContentRef.current.scrollTop = dialogContentRef.current.scrollHeight
                            }
                        }

                        // Immediate attempt
                        scrollToBottom()

                        // Multiple delayed attempts
                        setTimeout(scrollToBottom, 10)
                        setTimeout(scrollToBottom, 50)
                        setTimeout(scrollToBottom, 100)

                        // Also use MutationObserver to detect when the message is added to DOM
                        const observer = new MutationObserver(() => {
                            scrollToBottom()
                            // Disconnect after a short time
                            setTimeout(() => observer.disconnect(), 300)
                        })

                        // Start observing
                        if (dialogContentRef.current) {
                            observer.observe(dialogContentRef.current, { childList: true, subtree: true })
                        }
                    }

                    // Mark as read without triggering UI updates
                    axios
                        .get(`${API_BASE_URL}/api/chat/messages/${currentUserId}/${data.from._id}`, {
                            headers: { "Cache-Control": "no-cache" },
                        })
                        .catch((err) => console.error("Error marking messages as read:", err))
                } else {
                    // Show notification
                    setNotification({
                        from: data.from,
                        message: data.message,
                    })
                    setShowNotification(true)

                    // Hide notification after 5 seconds
                    setTimeout(() => {
                        setShowNotification(false)
                    }, 5000)
                }

                // Debounce chat list updates to prevent flickering
                if (chatUpdateTimeoutRef.current) {
                    clearTimeout(chatUpdateTimeoutRef.current)
                }

                chatUpdateTimeoutRef.current = setTimeout(() => {
                    fetchChatUsers(currentUserId)
                }, 300)
            })

            // Listen for messages read event
            socket.on("messages_read", (data) => {
                console.log("Messages read event received:", data)

                // Update read status in messages if we're the sender and the receiver has read our messages
                if (currentUserId === data.senderId && currentReceiverIdRef.current === data.receiverId) {
                    console.log("Updating read status for messages from", currentUserId, "to", data.receiverId)

                    // Update messages without causing a full re-render
                    setMessages((prevMessages) => prevMessages.map((msg) => (msg.sender === "me" ? { ...msg, read: true } : msg)))
                }

                // Debounce chat list updates to prevent flickering
                if (chatUpdateTimeoutRef.current) {
                    clearTimeout(chatUpdateTimeoutRef.current)
                }

                chatUpdateTimeoutRef.current = setTimeout(() => {
                    fetchChatUsers(currentUserId)
                }, 300)
            })

            // Listen for chat list update event with debouncing
            socket.on("update_chat_list", (data) => {
                if (data.userId === currentUserId) {
                    // Debounce updates to prevent flickering
                    if (chatUpdateTimeoutRef.current) {
                        clearTimeout(chatUpdateTimeoutRef.current)
                    }

                    chatUpdateTimeoutRef.current = setTimeout(() => {
                        fetchChatUsers(currentUserId)
                    }, 300)
                }
            })

            // Listen for chat list updates with debouncing
            socket.on("updateChatList", () => {
                // Debounce updates to prevent flickering
                if (chatUpdateTimeoutRef.current) {
                    clearTimeout(chatUpdateTimeoutRef.current)
                }

                chatUpdateTimeoutRef.current = setTimeout(() => {
                    fetchChatUsers(currentUserId)
                }, 300)
            })
        }

        return () => {
            if (socket) {
                socket.off("newMessage")
                socket.off("messagesRead")
                socket.off("updateChatList")
                socket.off("messages_read")
                socket.off("update_chat_list")
            }
        }
    }, [socket, currentUserId, showChatBox, isScrollLocked])

    // Check login status and fetch current user ID from localStorage
    useEffect(() => {
        checkLoginStatus()
    }, [])

    // Handle scrolling when messages change
    useEffect(() => {
        if (showChatBox && messages.length > 0 && !isScrollLocked) {
            // Clear any existing scroll timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current)
            }

            // Use a more reliable approach to scroll to bottom
            const scrollToBottom = () => {
                if (dialogContentRef.current && activeDialogIdRef.current === currentReceiverId) {
                    dialogContentRef.current.scrollTop = dialogContentRef.current.scrollHeight
                }
            }

            // Immediate scroll attempt
            scrollToBottom()

            // Also try after a short delay to ensure DOM is fully updated
            scrollTimeoutRef.current = setTimeout(scrollToBottom, 100)
        }
    }, [messages, showChatBox, isScrollLocked, currentReceiverId])

    // Handle chat box opening and closing
    useEffect(() => {
        if (showChatBox) {
            chatOpenedRef.current = true
            activeDialogIdRef.current = currentReceiverId

            // When chat box is opened, set a flag to indicate messages are being loaded
            messagesLoadedRef.current = false

            // Reset scroll lock when opening chat
            setIsScrollLocked(false)
        } else {
            chatOpenedRef.current = false
            messagesLoadedRef.current = false
            activeDialogIdRef.current = null
        }
    }, [showChatBox, currentReceiverId])

    // Handle messages loaded
    useEffect(() => {
        if (showChatBox && messages.length > 0 && !messagesLoadedRef.current && !isScrollLocked) {
            messagesLoadedRef.current = true

            // Clear any existing scroll timeout
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current)
            }

            // Set a timeout to scroll after the DOM has updated
            scrollTimeoutRef.current = setTimeout(() => {
                if (dialogContentRef.current && activeDialogIdRef.current === currentReceiverId) {
                    dialogContentRef.current.scrollTop = dialogContentRef.current.scrollHeight
                }
            }, 200)
        }
    }, [messages, showChatBox, isScrollLocked])

    // Add scroll event listener to detect manual scrolling
    useEffect(() => {
        const handleScroll = () => {
            if (!dialogContentRef.current) return

            const { scrollTop, scrollHeight, clientHeight } = dialogContentRef.current
            const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 20

            // If user has scrolled up, lock auto-scrolling
            if (!isScrolledToBottom && !isScrollLocked) {
                setIsScrollLocked(true)
            }

            // If user has scrolled to bottom, unlock auto-scrolling
            if (isScrolledToBottom && isScrollLocked) {
                setIsScrollLocked(false)
            }
        }

        if (dialogContentRef.current) {
            dialogContentRef.current.addEventListener("scroll", handleScroll)
        }

        return () => {
            if (dialogContentRef.current) {
                dialogContentRef.current.removeEventListener("scroll", handleScroll)
            }
        }
    }, [isScrollLocked, showChatBox])

    const { LoggedIn } = useContext(AuthContext)

    const checkLoginStatus = () => {
        if (!LoggedIn) {
            console.log("User not logged in according to AuthContext")
            return
        }

        // Get token from localStorage
        const token = localStorage.getItem("token")

        if (token) {
            try {
                // Parse the JWT token to get user data
                const decodedToken = parseJwt(token)

                if (decodedToken) {
                    // Handle both user tokens (userId) and agent tokens (id)
                    const userId = decodedToken.userId || decodedToken.id

                    if (userId) {
                        console.log("User ID extracted from token:", userId)
                        setCurrentUserId(userId)

                        // Set user name from token or use default
                        setCurrentUserName(decodedToken.name || decodedToken.companyName || "User")

                        // Check if user type is stored in token or localStorage
                        const userType = decodedToken.user || decodedToken.userType || localStorage.getItem("userType") || "user"
                        setCurrentUserType(userType)
                        localStorage.setItem("userType", userType)

                        fetchChatUsers(userId)

                        // If there's a pending agent, start chat with them now that we're logged in
                        if (pendingAgent) {
                            const agent = pendingAgent
                            setPendingAgent(null)
                            startChatWithAgent(agent)
                        }
                    } else {
                        console.error("Token decoded but missing userId or id:", decodedToken)
                    }
                } else {
                    console.error("Failed to decode token")
                }
            } catch (error) {
                console.error("Error processing token:", error)
            }
        } else {
            console.error("User is logged in according to AuthContext but no token found in localStorage")
        }
    }

    // Fetch chat users with throttling to prevent excessive API calls
    const fetchChatUsers = async (userId) => {
        // Throttle API calls to prevent excessive updates
        const now = Date.now()
        if (now - lastFetchTimeRef.current < 500) {
            console.log("Throttling chat users fetch")
            return
        }

        lastFetchTimeRef.current = now

        try {
            setLoading(true)
            const response = await axios.get(`${API_BASE_URL}/api/chat/users/${userId}`, {
                headers: { "Cache-Control": "no-cache" },
            })

            if (response.data.success) {
                // Remove duplicates by creating a Map with _id as key
                const uniqueUsers = new Map()

                if (response.data.chatUsers && Array.isArray(response.data.chatUsers)) {
                    response.data.chatUsers.forEach((user) => {
                        if (user && user._id) {
                            // Store the original timestamp for time ago calculations
                            const enhancedUser = {
                                ...user,
                                lastMessageTime: user.timestamp || new Date(), // Store the original timestamp
                                time: user.time || getTimeAgo(user.timestamp || new Date()), // Ensure time is always set
                            }
                            uniqueUsers.set(user._id, enhancedUser)
                        }
                    })
                }

                // Convert Map values back to array
                const dedupedUsers = Array.from(uniqueUsers.values())

                console.log(`Fetched ${response.data.chatUsers?.length || 0} chat users, deduped to ${dedupedUsers.length}`)
                setChatUsers(dedupedUsers)

                // Update current user type if provided by the server
                if (response.data.currentUserType) {
                    setCurrentUserType(response.data.currentUserType)
                    localStorage.setItem("userType", response.data.currentUserType)
                    console.log("Current user type set from server:", response.data.currentUserType)
                }

                const newTotalUnread = dedupedUsers.reduce((total, user) => total + (user.unreadCount || 0), 0)
                setTotalUnreadMessages(newTotalUnread)
            }
            setLoading(false)
        } catch (error) {
            console.error("Error fetching chat users:", error)
            setLoading(false)
            // If no chat users exist yet, set empty array
            setChatUsers([])
        }
    }

    // Fetch messages for a specific chat
    const fetchMessages = async (receiverId, receiverType) => {
        try {
            setLoading(true)
            messagesLoadedRef.current = false

            // Reset scroll lock when loading new messages
            setIsScrollLocked(false)

            const response = await axios.get(`${API_BASE_URL}/api/chat/messages/${currentUserId}/${receiverId}`, {
                headers: { "Cache-Control": "no-cache" },
            })

            if (response.data.success) {
                // Update messages in a single state update to prevent flickering
                setMessages(response.data.messages || [])

                // Update current user type if provided by the server
                if (response.data.currentUserType) {
                    setCurrentUserType(response.data.currentUserType)
                    localStorage.setItem("userType", response.data.currentUserType)
                }

                // Set the receiver type
                setCurrentReceiverType(receiverType)

                // Set active dialog ID
                activeDialogIdRef.current = receiverId

                // Force scroll to bottom after messages are loaded with multiple attempts
                // First attempt - immediate
                if (dialogContentRef.current && activeDialogIdRef.current === receiverId) {
                    dialogContentRef.current.scrollTop = dialogContentRef.current.scrollHeight
                }

                // Second attempt - after a short delay
                setTimeout(() => {
                    if (dialogContentRef.current && activeDialogIdRef.current === receiverId) {
                        dialogContentRef.current.scrollTop = dialogContentRef.current.scrollHeight
                    }
                }, 100)

                // Third attempt - after DOM has likely updated
                setTimeout(() => {
                    if (dialogContentRef.current && activeDialogIdRef.current === receiverId) {
                        dialogContentRef.current.scrollTop = dialogContentRef.current.scrollHeight
                    }
                }, 300)

                // Update chat users without causing a re-render of the chat box
                setTimeout(() => {
                    fetchChatUsers(currentUserId)
                }, 300)
            } else {
                setMessages([])
            }
            setLoading(false)
        } catch (error) {
            console.error("Error fetching messages:", error)
            setLoading(false)
            setMessages([])
        }
    }

    // Add a function to manually mark messages as read when opening a chat
    const markMessagesAsRead = (senderId, receiverId) => {
        if (!socket || !senderId || !receiverId) return

        console.log(`Manually marking messages from ${senderId} to ${receiverId} as read`)

        // Emit event to mark messages as read
        socket.emit("mark_messages_read", {
            senderId: senderId, // The person who sent the message
            receiverId: receiverId, // The person who's reading it (current user)
        })

        // Also update the UI immediately to reflect read status
        setChatUsers((prevUsers) => {
            return prevUsers.map((u) => {
                if (u._id === senderId) {
                    return { ...u, hasUnread: false, unreadCount: 0 }
                }
                return u
            })
        })

        // Calculate new total unread count
        const newTotalUnreadMessages = chatUsers.reduce((total, u) => {
            if (u._id === senderId) return total
            return total + (u.unreadCount || 0)
        }, 0)

        // Force update the total unread count
        setTotalUnreadMessages(newTotalUnreadMessages)
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const openChat = (user) => {
        // First close the menu to prevent UI jank
        handleClose()

        // Set a flag to indicate we're opening a new chat
        const isNewChatOpening = true

        // Batch state updates to reduce flickering
        const batchedUpdates = () => {
            // Reset messages first to prevent flashing old messages
            setMessages([])

            // Reset scroll lock
            setIsScrollLocked(false)

            // Set up the chat with the selected user
            setActiveChatUser(user.name)
            setCurrentReceiverId(user._id)
            setCurrentReceiverType(user.userType)

            // Update active dialog ID
            activeDialogIdRef.current = user._id

            // Update UI to show no unread messages for this conversation
            setChatUsers((prevUsers) => {
                return prevUsers.map((u) => {
                    if (u._id === user._id) {
                        return { ...u, hasUnread: false, unreadCount: 0 }
                    }
                    return u
                })
            })

            // Calculate new total unread count
            const newTotalUnreadMessages = chatUsers.reduce((total, u) => {
                if (u._id === user._id) return total
                return total + (u.unreadCount || 0)
            }, 0)

            // Update the total unread count
            setTotalUnreadMessages(newTotalUnreadMessages)

            // Finally, show the chat box
            setShowChatBox(true)
        }

        // Execute all updates in one go
        batchedUpdates()

        // Manually mark messages as read via socket
        markMessagesAsRead(user._id, currentUserId)

        // Then fetch messages (which will also mark them as read in the database)
        fetchMessages(user._id, user.userType)
    }

    const closeChat = () => {
        setShowChatBox(false)
        setActiveChatUser(null)
        setCurrentReceiverId("")
        setCurrentReceiverType("")
        setMessages([])
        setIsScrollLocked(false)
        activeDialogIdRef.current = null
    }

    // Function to start a chat with an agent
    const startChatWithAgent = useCallback(
        (agent) => {
            // Check if agent and agent._id exist
            if (!agent || !agent._id) {
                console.error("Invalid agent data:", agent)
                return
            }

            // If user is not logged in, store the agent for later
            if (!LoggedIn || !currentUserId) {
                console.error("User not logged in or currentUserId not set:", { LoggedIn, currentUserId })
                setPendingAgent(agent)
                alert("Please log in to chat with agents")
                return
            }

            console.log("Starting chat with agent:", agent.companyName, "User ID:", currentUserId, "Agent ID:", agent._id)

            // Reset messages to prevent flashing old messages
            setMessages([])

            // Reset scroll lock
            setIsScrollLocked(false)

            // Set up the chat with the agent
            setActiveChatUser(agent.companyName || "Agent")
            setCurrentReceiverId(agent._id)
            setCurrentReceiverType("agent") // Set the receiver type explicitly

            // Update active dialog ID
            activeDialogIdRef.current = agent._id

            // Fetch messages
            fetchMessages(agent._id, "agent")

            // Finally, show the chat box after everything is set up
            setShowChatBox(true)
        },
        [LoggedIn, currentUserId],
    )

    const handleSendMessage = async () => {
        if (message.trim() && currentUserId && currentReceiverId) {
            try {
                console.log("Current user type:", currentUserType)
                console.log("Current receiver type:", currentReceiverType)

                const newMessage = {
                    sender: currentUserId,
                    receiver: currentReceiverId,
                    content: message,
                }

                console.log("Sending message with data:", newMessage)
                console.log("Sending to URL:", `${API_BASE_URL}/api/chat/send`)

                // Optimistically update UI
                const tempId = Date.now()
                const currentTime = new Date()

                // Save current message content and clear input field
                const messageContent = message
                setMessage("")

                // Create the new message object
                const newMessageObj = {
                    id: tempId,
                    sender: "me",
                    content: messageContent,
                    time: currentTime.toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                    }),
                    timestamp: currentTime,
                    senderModel: currentUserType,
                    receiverModel: currentReceiverType,
                    read: false,
                }

                // Update messages in a single operation to prevent flickering
                setMessages((prevMessages) => [...prevMessages, newMessageObj])

                // Unlock auto-scrolling when sending a message
                setIsScrollLocked(false)

                // Scroll to bottom after sending with multiple attempts to ensure it works
                const scrollToBottom = () => {
                    if (dialogContentRef.current && activeDialogIdRef.current === currentReceiverId) {
                        dialogContentRef.current.scrollTop = dialogContentRef.current.scrollHeight
                    }
                }

                // Immediate attempt
                scrollToBottom()

                // Multiple delayed attempts to ensure it works after DOM updates
                setTimeout(scrollToBottom, 10)
                setTimeout(scrollToBottom, 50)
                setTimeout(scrollToBottom, 100)
                setTimeout(scrollToBottom, 200)

                // Also add a MutationObserver to detect when the message is actually added to the DOM
                const observer = new MutationObserver(() => {
                    scrollToBottom()
                    // Disconnect after a short time to avoid performance issues
                    setTimeout(() => observer.disconnect(), 300)
                })

                // Start observing the chat content for changes
                if (dialogContentRef.current) {
                    observer.observe(dialogContentRef.current, { childList: true, subtree: true })
                }

                // Send to server with explicit content type header
                const response = await axios.post(`${API_BASE_URL}/api/chat/send`, newMessage, {
                    headers: {
                        "Content-Type": "application/json",
                        "Cache-Control": "no-cache",
                    },
                })

                console.log("Response received:", response.data)

                if (!response.data.success) {
                    console.error("Failed to send message:", response.data)
                    // Remove the optimistic message if it failed
                    setMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== tempId))
                }

                // Debounce chat list updates to prevent flickering
                if (chatUpdateTimeoutRef.current) {
                    clearTimeout(chatUpdateTimeoutRef.current)
                }

                chatUpdateTimeoutRef.current = setTimeout(() => {
                    fetchChatUsers(currentUserId)
                }, 300)
            } catch (error) {
                console.error("Error sending message:", error)

                // Log more detailed error information
                if (error.response) {
                    console.error("Error response data:", error.response.data)
                    console.error("Error response status:", error.response.status)
                    console.error("Error response headers:", error.response.headers)
                } else if (error.request) {
                    console.error("Error request:", error.request)
                } else {
                    console.error("Error message:", error.message)
                }
            }
        }
    }

    // Handle notification click
    const handleNotificationClick = () => {
        if (notification) {
            openChat({
                _id: notification.from._id,
                name: notification.from.name,
                userType: notification.from.userType,
            })
            setShowNotification(false)
        }
    }

    // Filter chat users based on search term
    const filteredChatUsers = chatUsers.filter((user) => user.name.toLowerCase().includes(searchTerm.toLowerCase()))

    // Calculate total unread messages
    useEffect(() => {
        const count = chatUsers.reduce((total, user) => total + (user.unreadCount || 0), 0)
        setTotalUnreadMessages(count)
    }, [chatUsers])

    // Listen for messageAgent events from other components
    useEffect(() => {
        const handleMessageAgentEvent = (event) => {
            const { agent } = event.detail
            if (agent && agent._id) {
                startChatWithAgent(agent)
            }
        }

        // Add event listener
        window.addEventListener("messageAgent", handleMessageAgentEvent)

        // Clean up
        return () => {
            window.removeEventListener("messageAgent", handleMessageAgentEvent)
        }
    }, [startChatWithAgent])

    // Add this useEffect hook to handle initial scroll position when messages are loaded
    useEffect(() => {
        if (showChatBox && messages.length > 0 && dialogContentRef.current) {
            // Force scroll to bottom with multiple attempts
            const scrollToBottom = () => {
                if (dialogContentRef.current && activeDialogIdRef.current === currentReceiverId) {
                    dialogContentRef.current.scrollTop = dialogContentRef.current.scrollHeight
                }
            }

            // Immediate attempt
            scrollToBottom()

            // Multiple delayed attempts to ensure it works
            setTimeout(scrollToBottom, 50)
            setTimeout(scrollToBottom, 150)
            setTimeout(scrollToBottom, 300)
        }
    }, [showChatBox, messages.length, currentReceiverId])

    // Add a dedicated effect to maintain scroll position during updates
    useEffect(() => {
        // This function will be called whenever messages change
        const maintainScrollPosition = () => {
            if (!dialogContentRef.current || !showChatBox) return

            // Get current scroll info
            const { scrollTop, scrollHeight, clientHeight } = dialogContentRef.current
            const isScrolledToBottom = scrollHeight - scrollTop - clientHeight < 30

            // If we're already at the bottom or not scroll-locked, scroll to bottom
            if (isScrolledToBottom || !isScrollLocked) {
                const scrollToBottom = () => {
                    if (dialogContentRef.current && activeDialogIdRef.current === currentReceiverId) {
                        dialogContentRef.current.scrollTop = dialogContentRef.current.scrollHeight
                    }
                }

                // Multiple scroll attempts
                scrollToBottom()
                setTimeout(scrollToBottom, 10)
                setTimeout(scrollToBottom, 50)
                setTimeout(scrollToBottom, 150)
            }
        }

        // Call immediately
        maintainScrollPosition()

        // Also set up a MutationObserver to detect DOM changes
        const observer = new MutationObserver(maintainScrollPosition)

        if (dialogContentRef.current && showChatBox) {
            observer.observe(dialogContentRef.current, {
                childList: true,
                subtree: true,
                characterData: true,
            })
        }

        return () => {
            observer.disconnect()
        }
    }, [messages, showChatBox, isScrollLocked, currentReceiverId])

    return (
        <ThemeProvider theme={customTheme}>
            {/* Chat Dropdown Trigger */}
            <Box>
                <IconButton
                    size="large"
                    color="primary"
                    aria-controls={open ? "chat-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    onClick={handleClick}
                    sx={{
                        position: "relative",
                        "&:hover": {
                            bgcolor: "transparent",
                        },
                    }}
                >
                    <MessageIcon />
                    {totalUnreadMessages > 0 && (
                        <Badge
                            badgeContent={totalUnreadMessages}
                            color="error"
                            sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                "& .MuiBadge-badge": {
                                    fontSize: "0.6rem",
                                    height: 16,
                                    minWidth: 16,
                                },
                            }}
                        />
                    )}
                </IconButton>
                <Menu
                    id="chat-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        "aria-labelledby": "chat-button",
                    }}
                    PaperProps={{
                        sx: {
                            width: 360,
                            maxHeight: 500,
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
                        },
                    }}
                    transformOrigin={{ horizontal: "right", vertical: "top" }}
                    anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                >
                    <Box
                        sx={{
                            p: 2,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            borderBottom: "1px solid",
                            borderColor: "divider",
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Messages
                        </Typography>
                        <Box>
                            <IconButton size="small" sx={{ color: "text.secondary" }}>
                                <MoreVertIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>

                    <Box sx={{ px: 2, py: 1.5 }}>
                        <TextField
                            placeholder="Search messages..."
                            variant="outlined"
                            size="small"
                            fullWidth
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" color="disabled" />
                                    </InputAdornment>
                                ),
                                sx: {
                                    borderRadius: 20,
                                    bgcolor: "background.default",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "transparent",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "divider",
                                    },
                                },
                            }}
                        />
                    </Box>

                    <Box sx={{ px: 2, pb: 1 }}>
                        <Chip
                            label="All messages"
                            color="primary"
                            size="small"
                            sx={{
                                borderRadius: 1,
                                fontWeight: 500,
                                bgcolor: alpha("#4f46e5", 0.1),
                                color: "#4f46e5",
                                "& .MuiChip-label": {
                                    px: 1.5,
                                },
                            }}
                        />
                    </Box>

                    <List sx={{ width: "100%", maxHeight: 350, overflow: "auto" }}>
                        {loading ? (
                            <Box sx={{ p: 2, textAlign: "center" }}>
                                <Typography variant="body2" color="text.secondary">
                                    Loading...
                                </Typography>
                            </Box>
                        ) : filteredChatUsers.length > 0 ? (
                            filteredChatUsers.map((user, index) => (
                                <ListItem
                                    key={user._id} // Use _id instead of index for stable keys
                                    onClick={() => openChat(user)}
                                    sx={{
                                        px: 2,
                                        py: 1,
                                        cursor: "pointer",
                                        "&:hover": {
                                            bgcolor: "action.hover",
                                        },
                                    }}
                                    secondaryAction={
                                        user.hasUnread && (
                                            <Badge
                                                badgeContent={user.unreadCount}
                                                color="error"
                                                sx={{
                                                    "& .MuiBadge-badge": {
                                                        fontSize: "0.7rem",
                                                        height: 18,
                                                        minWidth: 18,
                                                    },
                                                }}
                                            />
                                        )
                                    }
                                >
                                    <ListItemAvatar>
                                        <Box sx={{ position: "relative" }}>
                                            <Avatar
                                                src={user.avatar ? `${API_BASE_URL}/uploads/${user.avatar}` : ""}
                                                alt={user.name}
                                                sx={{
                                                    width: 40,
                                                    height: 40,
                                                    border: user.status === "online" ? "2px solid" : "none",
                                                    borderColor: user.status === "online" ? "success.main" : "transparent",
                                                }}
                                            >
                                                {user.name.substring(0, 2)}
                                            </Avatar>
                                            {user.status === "online" && (
                                                <Box
                                                    sx={{
                                                        position: "absolute",
                                                        bottom: 0,
                                                        right: 0,
                                                        width: 10,
                                                        height: 10,
                                                        bgcolor: "success.main",
                                                        borderRadius: "50%",
                                                        border: "2px solid",
                                                        borderColor: "background.paper",
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontWeight: user.hasUnread ? 600 : "normal",
                                                    color: user.hasUnread ? "text.primary" : "text.secondary",
                                                }}
                                            >
                                                {user.name}
                                                <Chip
                                                    label={user.userType === "agent" ? "Agent" : "User"}
                                                    size="small"
                                                    sx={{
                                                        ml: 1,
                                                        height: 20,
                                                        fontSize: "0.6rem",
                                                        bgcolor: user.userType === "agent" ? "#EEF2FF" : "#F0FDF4",
                                                        color: user.userType === "agent" ? "#4F46E5" : "#16A34A",
                                                    }}
                                                />
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography
                                                variant="body2"
                                                sx={{
                                                    fontSize: "0.75rem",
                                                    color: user.hasUnread ? "text.primary" : "text.secondary",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 0.5,
                                                }}
                                            >
                                                {user.lastMessage} · {user.time}
                                            </Typography>
                                        }
                                        sx={{ my: 0 }}
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <Box sx={{ p: 2, textAlign: "center" }}>
                                <Typography variant="body2" color="text.secondary">
                                    {searchTerm ? "No matching conversations" : "No conversations yet"}
                                </Typography>
                            </Box>
                        )}
                    </List>
                </Menu>
            </Box>

            {/* Chat Box */}
            <Dialog
                open={showChatBox}
                onClose={closeChat}
                PaperProps={{
                    sx: {
                        position: "fixed",
                        bottom: 32,
                        right: 32,
                        m: 0,
                        width: 380,
                        height: 500,
                        borderRadius: 3,
                        boxShadow: 3,
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                    },
                }}
                maxWidth={false}
                BackdropProps={{ invisible: true }}
                TransitionProps={{
                    onEnter: () => {
                        // Reset scroll position when dialog starts to open
                        if (dialogContentRef.current) {
                            dialogContentRef.current.scrollTop = 0
                        }
                    },
                    onEntered: () => {
                        // After dialog is fully opened, force scroll to bottom
                        if (dialogContentRef.current && activeDialogIdRef.current === currentReceiverId) {
                            // Multiple scroll attempts to ensure it works
                            dialogContentRef.current.scrollTop = dialogContentRef.current.scrollHeight

                            // Also try after a short delay
                            setTimeout(() => {
                                if (dialogContentRef.current && activeDialogIdRef.current === currentReceiverId) {
                                    dialogContentRef.current.scrollTop = dialogContentRef.current.scrollHeight
                                }
                            }, 50)

                            // And again after a longer delay
                            setTimeout(() => {
                                if (dialogContentRef.current && activeDialogIdRef.current === currentReceiverId) {
                                    dialogContentRef.current.scrollTop = dialogContentRef.current.scrollHeight
                                }
                            }, 150)
                        }
                    },
                }}
                key={`chat-dialog-${currentReceiverId}`} // Add a unique key based on receiver ID
            >
                <Box
                    sx={{
                        bgcolor: "#4f46e5",
                        color: "white",
                        p: 1.5,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar
                            sx={{
                                width: 36,
                                height: 36,
                                bgcolor: "#4338ca",
                                border: "2px solid",
                                borderColor: "#6366f1",
                            }}
                        >
                            {activeChatUser?.substring(0, 2)}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {activeChatUser}
                                <Chip
                                    label={currentReceiverType === "agent" ? "Agent" : "User"}
                                    size="small"
                                    sx={{
                                        ml: 1,
                                        height: 16,
                                        fontSize: "0.6rem",
                                        bgcolor: "rgba(255, 255, 255, 0.2)",
                                        color: "white",
                                    }}
                                />
                            </Typography>
                            <Typography variant="caption" sx={{ opacity: 0.8 }}>
                                Online
                            </Typography>
                        </Box>
                    </Box>
                    <IconButton size="small" color="inherit" onClick={closeChat}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>

                <DialogContent
                    ref={dialogContentRef}
                    sx={{
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        overflow: "auto",
                        flexGrow: 1,
                        bgcolor: "background.default",
                    }}
                >
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                            <Typography variant="body2" color="text.secondary">
                                Loading messages...
                            </Typography>
                        </Box>
                    ) : messages.length > 0 ? (
                        messages.map((msg, index) => {
                            // Group messages by date
                            const showDate =
                                index === 0 || new Date(msg.time).toDateString() !== new Date(messages[index - 1].time).toDateString()

                            return (
                                <Box key={msg.id || index}>
                                    {showDate && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                my: 1,
                                            }}
                                        >
                                            <Typography
                                                variant="caption"
                                                color="text.secondary"
                                                sx={{
                                                    bgcolor: "action.selected",
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: 20,
                                                    fontSize: "0.65rem",
                                                }}
                                            >
                                                {msg.time}
                                            </Typography>
                                        </Box>
                                    )}

                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: msg.sender === "me" ? "flex-end" : "flex-start",
                                            px: 1,
                                        }}
                                    >
                                        <Paper
                                            sx={{
                                                bgcolor: msg.sender === "me" ? "#4f46e5" : "background.paper",
                                                color: msg.sender === "me" ? "white" : "text.primary",
                                                p: 1.5,
                                                borderRadius: 3,
                                                maxWidth: "85%",
                                                wordBreak: "break-word",
                                                boxShadow: "none",
                                                border: msg.sender !== "me" ? "1px solid" : "none",
                                                borderColor: "divider",
                                                position: "relative",
                                                ...(msg.sender === "me" && {
                                                    borderBottomRightRadius: 0,
                                                }),
                                                ...(msg.sender !== "me" && {
                                                    borderBottomLeftRadius: 0,
                                                }),
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                                {msg.content}
                                            </Typography>
                                            {msg.meta && (
                                                <Typography
                                                    variant="caption"
                                                    sx={{
                                                        display: "block",
                                                        mt: 0.5,
                                                        color: msg.sender === "me" ? "#a5b4fc" : "text.secondary",
                                                    }}
                                                >
                                                    {msg.meta}
                                                </Typography>
                                            )}
                                        </Paper>
                                    </Box>
                                </Box>
                            )
                        })
                    ) : (
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
                            <Typography variant="body2" color="text.secondary">
                                No messages yet. Start a conversation!
                            </Typography>
                        </Box>
                    )}
                    <div ref={messagesEndRef} />
                </DialogContent>

                <Divider />

                <DialogActions
                    sx={{
                        p: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        bgcolor: "background.paper",
                    }}
                >
                    <TextField
                        placeholder="Type a message..."
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ flex: 1 }}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        InputProps={{
                            sx: {
                                borderRadius: 20,
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "divider",
                                },
                            },
                        }}
                    />
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={handleSendMessage}
                        disabled={!message.trim() || !currentReceiverId}
                        sx={{
                            bgcolor: "#4f46e5",
                            color: "white",
                            "&:hover": {
                                bgcolor: "#4338ca",
                            },
                            "&:disabled": {
                                bgcolor: "action.disabledBackground",
                                color: "action.disabled",
                            },
                        }}
                    >
                        <SendIcon fontSize="small" />
                    </IconButton>
                </DialogActions>
            </Dialog>

            {/* Notification Toast */}
            <Zoom in={showNotification}>
                <Box
                    onClick={handleNotificationClick}
                    sx={{
                        position: "fixed",
                        bottom: 20,
                        right: 20,
                        width: 300,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 3,
                        p: 2,
                        zIndex: 9999,
                        cursor: "pointer",
                        border: "1px solid",
                        borderColor: "divider",
                        "&:hover": {
                            boxShadow: 6,
                        },
                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Avatar
                            sx={{
                                bgcolor: "#4f46e5",
                                width: 40,
                                height: 40,
                            }}
                        >
                            {notification?.from?.name?.substring(0, 2) || <NotificationsIcon />}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                {notification?.from?.name || "New message"}
                                <Chip
                                    label={notification?.from?.userType === "agent" ? "Agent" : "User"}
                                    size="small"
                                    sx={{
                                        ml: 1,
                                        height: 16,
                                        fontSize: "0.6rem",
                                        bgcolor: notification?.from?.userType === "agent" ? "#EEF2FF" : "#F0FDF4",
                                        color: notification?.from?.userType === "agent" ? "#4F46E5" : "#16A34A",
                                    }}
                                />
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {notification?.message?.content || "You have a new message"}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Zoom>
        </ThemeProvider>
    )
}

// Export the ChatSystem component
export default ChatSystem
