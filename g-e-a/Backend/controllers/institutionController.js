const InstitutionModel = require("../models/institutions");

// Get all institutions
const getAllInstitutions = async (req, res) => {
    try {
        const institutions = await InstitutionModel.find();
        res.status(200).json(institutions);
    } catch (err) {
        console.error("Error fetching institutions:", err);
        res.status(500).json({ error: "An error occurred while fetching the institutions" });
    }
};

// Add a new institution
const addInstitution = async (req, res) => {
    try {
        console.log("Request Body:", req.body);
        console.log("Request Files:", req.files);

        // Parse JSON stringified fields
        const locations = JSON.parse(req.body.locations);
        const programs = JSON.parse(req.body.programs);
        const scholarships = JSON.parse(req.body.scholarships);
        const agents = JSON.parse(req.body.agents);
        const incomeSources = JSON.parse(req.body.incomeSources || "[]");
        const sponsors = JSON.parse(req.body.sponsors || "[]");
        const banks = JSON.parse(req.body.banks || "[]");

        // Handle checkbox conversion
        const levelChangeAfterRefusal = req.body.levelChangeAfterRefusal === 'true';

        // Handle file paths
        const profilePicture = req.files["profilePicture"]?.[0]?.filename;
        const bannerImages = req.files["bannerImages"]?.map(file => file.filename) || [];

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
            locations,
            applicationFee: req.body.applicationFee,
            programs,
            scholarships,
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
                incomeSources,
                sponsors,
                minSponsorCount: req.body.minSponsorCount,
                minIncomeAmount: req.body.minIncomeAmount,
                banks,
                previousVisaRefusal: req.body.previousVisaRefusal,
                levelChangeAfterRefusal,
            },
            agents,
        });

        await newInstitution.save();
        res.status(201).json({ message: "Institution added successfully", institution: newInstitution });
    } catch (err) {
        console.error("Error adding institution:", err);
        res.status(500).json({ error: err.message });
    }
};

module.exports = { getAllInstitutions, addInstitution };