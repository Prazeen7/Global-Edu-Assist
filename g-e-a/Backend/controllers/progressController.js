const ProgressTracking = require("../models/progressTracking")

/**
 * Initialize progress tracking for a user
 * @route POST /api/progress/initialize
 * @access Private
 */
const initializeProgress = async (req, res) => {
    try {
        const { userId, userName } = req.body

        // Verify that the authenticated user is initializing their own progress
        if (req.user.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: "You are not authorized to initialize progress for this user",
            })
        }

        if (!userId || !userName) {
            return res.status(400).json({
                success: false,
                error: "User ID and name are required",
            })
        }

        // Check if progress already exists for this user
        const existingProgress = await ProgressTracking.findOne({ userId })
        if (existingProgress) {
            return res.status(400).json({
                success: false,
                error: "Progress tracking already initialized for this user",
            })
        }

        // Create new progress tracking
        const progressTracking = new ProgressTracking({
            userId,
            userName,
        })

        // Initialize default checklists
        progressTracking.initializeDefaultChecklists()

        // Save to database
        await progressTracking.save()

        res.status(201).json({
            success: true,
            message: "Progress tracking initialized successfully",
            data: progressTracking,
        })
    } catch (err) {
        console.error("Error initializing progress:", err)
        res.status(500).json({
            success: false,
            error: "Failed to initialize progress tracking",
            details: err.message,
        })
    }
}

/**
 * Get progress for a user
 * @route GET /api/progress/:userId
 * @access Private
 */
const getProgress = async (req, res) => {
    try {
        const { userId } = req.params

        // Verify that the authenticated user is accessing their own progress
        if (req.user.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: "You are not authorized to access progress for this user",
            })
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
            })
        }

        // Find progress for this user
        const progressTracking = await ProgressTracking.findOne({ userId })

        // If no progress exists, return error
        if (!progressTracking) {
            return res.status(404).json({
                success: false,
                error: "Progress tracking not found for this user",
            })
        }

        res.status(200).json({
            success: true,
            data: progressTracking,
        })
    } catch (err) {
        console.error("Error fetching progress:", err)
        res.status(500).json({
            success: false,
            error: "Failed to fetch progress",
            details: err.message,
        })
    }
}

/**
 * Update progress for a specific stage
 * @route PUT /api/progress/:userId/update
 * @access Private
 */
const updateStageProgress = async (req, res) => {
    try {
        const { userId } = req.params
        const { stage, items, currentStage } = req.body

        // Verify that the authenticated user is updating their own progress
        if (req.user.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: "You are not authorized to update progress for this user",
            })
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
            })
        }

        // Validate stage
        const validStages = ["offer", "gs", "coe", "visa"]
        if (!validStages.includes(stage)) {
            return res.status(400).json({
                success: false,
                error: "Invalid stage. Must be one of: offer, gs, coe, visa",
            })
        }

        // Find progress for this user
        let progressTracking = await ProgressTracking.findOne({ userId })

        // If no progress exists, return error
        if (!progressTracking) {
            return res.status(404).json({
                success: false,
                error: "Progress tracking not found for this user",
            })
        }

        // Update items for the specified stage
        progressTracking.stages[stage].items = items

        // Update current stage if provided
        if (currentStage && validStages.includes(currentStage)) {
            progressTracking.currentStage = currentStage
        }

        // Recalculate totals
        progressTracking.calculateTotals()

        try {
            // Save to database with error handling for version conflicts
            await progressTracking.save()
        } catch (saveError) {
            if (saveError.name === "VersionError") {
                // If we get a version error, fetch the latest document and retry
                console.log(`Version error detected for user ${userId}, retrying with fresh document`)

                // Fetch the latest document
                progressTracking = await ProgressTracking.findOne({ userId })

                if (!progressTracking) {
                    throw new Error(`Progress tracking document for user ${userId} no longer exists`)
                }

                // Update the document again
                progressTracking.stages[stage].items = items

                if (currentStage && validStages.includes(currentStage)) {
                    progressTracking.currentStage = currentStage
                }

                progressTracking.calculateTotals()

                // Save again
                await progressTracking.save()
            } else {
                // If it's not a version error, rethrow
                throw saveError
            }
        }

        res.status(200).json({
            success: true,
            message: "Progress updated successfully",
            data: progressTracking,
        })
    } catch (err) {
        console.error(`Error updating progress for user ${req.params.userId}:`, err)
        res.status(500).json({
            success: false,
            error: "Failed to update progress",
            details: err.message,
        })
    }
}

/**
 * Reset progress for a user
 * @route POST /api/progress/:userId/reset
 * @access Private
 */
const resetProgress = async (req, res) => {
    try {
        const { userId } = req.params

        // Verify that the authenticated user is resetting their own progress
        if (req.user.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: "You are not authorized to reset progress for this user",
            })
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
            })
        }

        // Find progress for this user
        const progressTracking = await ProgressTracking.findOne({ userId })

        // If no progress exists, return error
        if (!progressTracking) {
            return res.status(404).json({
                success: false,
                error: "Progress tracking not found for this user",
            })
        }

        // Reset all stages
        progressTracking.initializeDefaultChecklists()
        progressTracking.currentStage = "offer"
        progressTracking.isCompleted = false
        progressTracking.completedAt = null

        // Save to database
        await progressTracking.save()

        res.status(200).json({
            success: true,
            message: "Progress reset successfully",
            data: progressTracking,
        })
    } catch (err) {
        console.error("Error resetting progress:", err)
        res.status(500).json({
            success: false,
            error: "Failed to reset progress",
            details: err.message,
        })
    }
}

/**
 * Mark progress tracking as complete
 * @route POST /api/progress/:userId/complete
 * @access Private
 */
const completeProgress = async (req, res) => {
    try {
        const { userId } = req.params

        // Verify that the authenticated user is completing their own progress
        if (req.user.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: "You are not authorized to complete progress for this user",
            })
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
            })
        }

        // Find progress for this user
        const progressTracking = await ProgressTracking.findOne({ userId })

        // If no progress exists, return error
        if (!progressTracking) {
            return res.status(404).json({
                success: false,
                error: "Progress tracking not found for this user",
            })
        }

        // Mark as completed
        progressTracking.isCompleted = true
        progressTracking.completedAt = new Date()

        // Save to database
        await progressTracking.save()

        res.status(200).json({
            success: true,
            message: "Progress tracking marked as complete",
            data: progressTracking,
        })
    } catch (err) {
        console.error("Error completing progress:", err)
        res.status(500).json({
            success: false,
            error: "Failed to complete progress tracking",
            details: err.message,
        })
    }
}

/**
 * Deselect all items in a specific stage
 * @route POST /api/progress/:userId/deselect/:stage
 * @access Private
 */
const deselectAllStageItems = async (req, res) => {
    try {
        const { userId, stage } = req.params

        // Verify that the authenticated user is deselecting items for their own progress
        if (req.user.userId !== userId) {
            return res.status(403).json({
                success: false,
                error: "You are not authorized to modify progress for this user",
            })
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: "User ID is required",
            })
        }

        // Validate stage
        const validStages = ["offer", "gs", "coe", "visa"]
        if (!validStages.includes(stage)) {
            return res.status(400).json({
                success: false,
                error: "Invalid stage. Must be one of: offer, gs, coe, visa",
            })
        }

        // Find progress for this user
        const progressTracking = await ProgressTracking.findOne({ userId })

        // If no progress exists, return error
        if (!progressTracking) {
            return res.status(404).json({
                success: false,
                error: "Progress tracking not found for this user",
            })
        }

        // Helper function to uncheck all items recursively
        const uncheckItems = (items) => {
            return items.map((item) => {
                const updatedItem = { ...item, checked: false }

                if (item.children && item.children.length > 0) {
                    updatedItem.children = uncheckItems(item.children)
                }

                return updatedItem
            })
        }

        // Uncheck all items in the specified stage
        progressTracking.stages[stage].items = uncheckItems(progressTracking.stages[stage].items)

        // Recalculate totals
        progressTracking.calculateTotals()

        // Save to database
        await progressTracking.save()

        res.status(200).json({
            success: true,
            message: `All items in ${stage} stage deselected successfully`,
            data: progressTracking,
        })
    } catch (err) {
        console.error("Error deselecting items:", err)
        res.status(500).json({
            success: false,
            error: "Failed to deselect items",
            details: err.message,
        })
    }
}

module.exports = {
    initializeProgress,
    getProgress,
    updateStageProgress,
    resetProgress,
    completeProgress,
    deselectAllStageItems,
}
