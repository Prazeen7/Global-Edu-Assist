const InstitutionModel = require("../models/institutions")

// Get all institutions with filtering
const getAllInstitutions = async (req, res) => {
    try {
        const { search, location } = req.query

        // Query object
        const query = {}

        // Add search filter if provided
        if (search) {
            query.institutionName = { $regex: search, $options: "i" } // Case-insensitive search
        }

        // Add location filter if provided and not 'all'
        if (location && location !== "all") {
            query["locations.city"] = location
        }

        const institutions = await InstitutionModel.find(query)
        res.status(200).json(institutions)
    } catch (err) {
        console.error("Error fetching institutions:", err)
        res.status(500).json({
            error: "An error occurred while fetching institutions",
        })
    }
}

// Add a new institution
const addInstitution = async (req, res) => {
    try {
        // Validate required fields
        if (!req.body.institutionName || !req.body.institutionType) {
            return res.status(400).json({
                error: "Institution name and type are required",
            })
        }

        // Handle file paths
        const profilePicture = req.files && req.files["profilePicture"] ? req.files["profilePicture"][0].filename : null
        const bannerImages =
            req.files && req.files["bannerImages"] ? req.files["bannerImages"].map((file) => file.filename) : []

        // Validate profile picture
        if (!profilePicture) {
            return res.status(400).json({
                error: "Profile picture is required",
            })
        }

        // Create new institution
        const newInstitution = new InstitutionModel({
            institutionName: req.body.institutionName,
            institutionType: req.body.institutionType,
            profilePicture,
            bannerImages,
            overview: {
                heading: req.body.overviewHeading,
                details: req.body.overviewDetails,
            },
            locations: req.body.locations,
            applicationFee: req.body.applicationFee,
            programs: req.body.programs,
            scholarships: req.body.scholarships,
            entryRequirements: {
                undergraduate: {
                    GPA: req.body.undergraduateGPA,
                    IELTS: req.body.undergraduateIELTS,
                    PTE: req.body.undergraduatePTE,
                    TOEFL: req.body.undergraduateTOEFL,
                },
                postgraduate: {
                    GPA: req.body.postgraduateGPA,
                    IELTS: req.body.postgraduateIELTS,
                    PTE: req.body.postgraduatePTE,
                    TOEFL: req.body.postgraduateTOEFL,
                },
            },
            documents: {
                incomeSources: req.body.incomeSources,
                sponsors: req.body.sponsors,
                minSponsorCount: req.body.minSponsorCount,
                minIncomeAmount: req.body.minIncomeAmount,
                banks: req.body.banks,
                previousVisaRefusal: req.body.previousVisaRefusal,
                levelChangeAfterRefusal: req.body.levelChangeAfterRefusal,
            },
            agents: req.body.agents,
        })

        await newInstitution.save()

        res.status(201).json({
            message: "Institution added successfully",
            institution: newInstitution,
        })
    } catch (err) {
        console.error("Error adding institution:", err)

        // Handle duplicate key errors
        if (err.code === 11000) {
            return res.status(400).json({
                error: "Institution with this name already exists",
            })
        }

        // Handle validation errors
        if (err.name === "ValidationError") {
            return res.status(400).json({
                error: Object.values(err.errors)
                    .map((val) => val.message)
                    .join(", "),
            })
        }

        res.status(500).json({
            error: "An error occurred while adding the institution",
        })
    }
}

// Process scholarships to ensure proper _id handling
const updateInstitution = async (req, res) => {
    try {
        const { id } = req.params
        const updates = req.body

        // Process locations to ensure proper _id handling
        if (updates.locations && Array.isArray(updates.locations)) {
            updates.locations = updates.locations.map((location) => {
                if (location._id && typeof location._id === "string" && !location._id.match(/^[0-9a-fA-F]{24}$/)) {
                    const { _id, ...locationWithoutId } = location
                    return locationWithoutId
                }
                return location
            })
        }

        // Process scholarships to ensure proper _id handling
        if (updates.scholarships && Array.isArray(updates.scholarships)) {
            updates.scholarships = updates.scholarships.map((scholarship) => {
                if (scholarship._id && typeof scholarship._id === "string" && !scholarship._id.match(/^[0-9a-fA-F]{24}$/)) {
                    const { _id, ...scholarshipWithoutId } = scholarship
                    return scholarshipWithoutId
                }
                return scholarship
            })
        }

        // Process programs to ensure proper _id handling
        if (updates.programs && Array.isArray(updates.programs)) {
            updates.programs = updates.programs.map((program) => {
                if (program._id && typeof program._id === "string" && !program._id.match(/^[0-9a-fA-F]{24}$/)) {
                    const { _id, ...programWithoutId } = program
                    return programWithoutId
                }
                return program
            })
        }

        // Find and update the institution
        const updatedInstitution = await InstitutionModel.findByIdAndUpdate(id, updates, { new: true, runValidators: true })

        if (!updatedInstitution) {
            return res.status(404).json({ error: "Institution not found" })
        }

        res.status(200).json({
            message: "Institution updated successfully",
            institution: updatedInstitution,
        })
    } catch (err) {
        console.error("Error updating institution:", err)

        // Handle duplicate key errors
        if (err.code === 11000) {
            return res.status(400).json({
                error: "Institution with this name already exists",
            })
        }

        // Handle validation errors
        if (err.name === "ValidationError") {
            return res.status(400).json({
                error: Object.values(err.errors)
                    .map((val) => val.message)
                    .join(", "),
            })
        }

        res.status(500).json({
            error: `Error updating institution: ${err.message}`,
        })
    }
}

// Unified delete function
const deleteInstitutionItem = async (req, res) => {
    try {
        const { id, field, itemId } = req.params
        const validFields = ["banner", "locations", "programs", "scholarships"]

        // Validate field
        if (!validFields.includes(field)) {
            return res.status(400).json({ error: "Invalid field specified" })
        }

        const institution = await InstitutionModel.findById(id)
        if (!institution) {
            return res.status(404).json({ error: "Institution not found" })
        }

        // Handle banner images (special case with index)
        if (field === "banner") {
            const imageIndex = Number.parseInt(itemId)
            if (isNaN(imageIndex) || imageIndex < 0 || imageIndex >= institution.bannerImages.length) {
                return res.status(400).json({ error: "Invalid image index" })
            }
            institution.bannerImages.splice(imageIndex, 1)
        }
        // Handle other fields (using _id)
        else {
            const arrayField = institution[field]
            const initialLength = arrayField.length

            institution[field] = arrayField.filter((item) => item._id.toString() !== itemId)

            if (initialLength === institution[field].length) {
                return res.status(404).json({ error: `${field.slice(0, -1)} not found` })
            }
        }

        await institution.save()

        res.status(200).json({
            message: `${field.slice(0, -1)} deleted successfully`,
            institution,
        })
    } catch (err) {
        console.error(`Error deleting ${field} item:`, err)
        res.status(500).json({
            error: `An error occurred while deleting the ${field.slice(0, -1)}`,
        })
    }
}

module.exports = { getAllInstitutions, addInstitution, updateInstitution, deleteInstitutionItem }
