const express = require("express");
const router = express.Router();
const docsModel = require("../models/documents");

// Get all documents
router.get("/documents", async (req, res) => {
    try {
        const documents = await docsModel.find();
        res.json(documents.length ? documents : { message: "No document found" });
    } catch (err) {
        res.status(500).json({ error: "An error occurred while fetching the documents" });
    }
});

module.exports = router;
