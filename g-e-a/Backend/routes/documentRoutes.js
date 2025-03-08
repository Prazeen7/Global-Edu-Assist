const express = require("express");
const router = express.Router();
const { getAllDocuments } = require("../controllers/documentController");

// Get all documents
router.get("/documents", getAllDocuments);

module.exports = router;