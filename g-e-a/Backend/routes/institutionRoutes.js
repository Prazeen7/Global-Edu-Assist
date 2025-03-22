const express = require("express");
const router = express.Router();
const upload = require("../config/multerConfig");
const { getAllInstitutions, addInstitution } = require("../controllers/institutionController");

// Get all institutions
router.get("/institutions", getAllInstitutions);

// Add a new institution with file uploads
router.post("/institutions", upload, (req, res, next) => {
    // Manually parse JSON fields or set default values
    req.body.locations = req.body.locations || "[]";
    req.body.programs = req.body.programs || "[]";
    req.body.scholarships = req.body.scholarships || "[]";
    req.body.agents = req.body.agents || "[]";
    req.body.incomeSources = req.body.incomeSources || "[]";
    req.body.sponsors = req.body.sponsors || "[]";
    req.body.banks = req.body.banks || "[]";
    next();
}, addInstitution);

module.exports = router;