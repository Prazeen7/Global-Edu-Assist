const express = require("express");
const router = express.Router();
const { getAllInstitutions } = require("../controllers/institutionController");

// Get all institutions
router.get("/institutions", getAllInstitutions);

module.exports = router;