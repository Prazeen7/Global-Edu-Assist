const express = require("express");
const router = express.Router();
const { getAllPrograms } = require("../controllers/ProgramController");

// Get all programs
router.get("/programs", getAllPrograms);

module.exports = router;