const express = require("express");
const router = express.Router();
const { upload, handleUploadErrors } = require("../config/multerConfig");
const {
    getAllInstitutions,
    addInstitution,
    updateInstitution, 
    deleteInstitutionItem
} = require("../controllers/institutionController");

// Middleware to parse JSON fields or set defaults
const parseFormData = (req, res, next) => {
    try {
        req.body.locations = req.body.locations ? JSON.parse(req.body.locations) : [];
        req.body.programs = req.body.programs ? JSON.parse(req.body.programs) : [];
        req.body.scholarships = req.body.scholarships ? JSON.parse(req.body.scholarships) : [];
        req.body.agents = req.body.agents ? JSON.parse(req.body.agents) : [];
        req.body.incomeSources = req.body.incomeSources ? JSON.parse(req.body.incomeSources) : [];
        req.body.sponsors = req.body.sponsors ? JSON.parse(req.body.sponsors) : [];
        req.body.banks = req.body.banks ? JSON.parse(req.body.banks) : [];
        
        // Handle checkbox conversion
        req.body.levelChangeAfterRefusal = req.body.levelChangeAfterRefusal === "true";
        
        next();
    } catch (err) {
        console.error("Error parsing form data:", err);
        res.status(400).json({ error: "Invalid form data format" });
    }
};

// Get all institutions
router.get("/institutions", getAllInstitutions);

// Add a new institution with file uploads
router.post(
    "/institutions",
    upload,
    parseFormData,
    handleUploadErrors,
    addInstitution
);

// Update an institution
router.put("/institutions/:id", updateInstitution);

router.delete("/institutions/:id/:field/:itemId", deleteInstitutionItem);

module.exports = router;