const express = require("express")
const router = express.Router()
const { getAllDocuments, addDocument, updateDocument, deleteDocument } = require("../controllers/documentController")

// Get all documents
router.get("/documents", getAllDocuments)

// Add a new document
router.post("/documents", addDocument)

// Update a document
router.put("/documents/:id", updateDocument)

// Delete a document
router.delete("/documents/:id", deleteDocument)

module.exports = router
