const express = require("express");
const router = express.Router();
const InstitutionModel = require("../models/institutions");

// Get all institutions
router.get("/institutions", async (req, res) => {
    try {
        const institutions = await InstitutionModel.find();
        res.json(institutions.length ? institutions : { message: "No institutions found" });
    } catch (err) {
        res.status(500).json({ error: "An error occurred while fetching the institutions" });
    }
});

module.exports = router;
