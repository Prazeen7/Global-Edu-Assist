const docsModel = require("../models/documents")

// Get all documents
const getAllDocuments = async (req, res) => {
    try {
        const documents = await docsModel.find()
        res.json(documents.length ? documents : { message: "No documents found" })
    } catch (err) {
        console.error("Error fetching documents:", err)
        res.status(500).json({ error: "An error occurred while fetching the documents" })
    }
}

// Get a single document by ID
const getDocumentById = async (req, res) => {
    try {
        const document = await docsModel.findById(req.params.id)
        if (!document) {
            return res.status(404).json({ error: "Document not found" })
        }
        res.json(document)
    } catch (err) {
        console.error("Error fetching document:", err)
        res.status(500).json({ error: "An error occurred while fetching the document" })
    }
}

// Add a new document
const addDocument = async (req, res) => {
    try {
        const { document, docs, src, info } = req.body

        // Validate required fields
        if (!document || !docs || !src || !info) {
            return res.status(400).json({ error: "All fields are required" })
        }

        // Validate arrays have the same length
        if (docs.length !== src.length || docs.length !== info.length) {
            return res.status(400).json({ error: "Document, source, and information arrays must have the same length" })
        }

        // Create new document
        const newDocument = new docsModel({
            document,
            docs,
            src,
            info,
        })

        const savedDocument = await newDocument.save()
        res.status(201).json(savedDocument)
    } catch (err) {
        console.error("Error adding document:", err)
        res.status(500).json({ error: "An error occurred while adding the document" })
    }
}

// Update a document
const updateDocument = async (req, res) => {
    try {
        const { id } = req.params
        const { document, docs, src, info } = req.body

        // Validate required fields
        if (!document || !docs || !src || !info) {
            return res.status(400).json({ error: "All fields are required" })
        }

        // Validate arrays have the same length
        if (docs.length !== src.length || docs.length !== info.length) {
            return res.status(400).json({ error: "Document, source, and information arrays must have the same length" })
        }

        // Find and update the document
        const updatedDocument = await docsModel.findByIdAndUpdate(
            id,
            { document, docs, src, info },
            { new: true, runValidators: true },
        )

        if (!updatedDocument) {
            return res.status(404).json({ error: "Document not found" })
        }

        res.status(200).json(updatedDocument)
    } catch (err) {
        console.error("Error updating document:", err)
        res.status(500).json({ error: "An error occurred while updating the document" })
    }
}

// Delete a document
const deleteDocument = async (req, res) => {
    try {
        const { id } = req.params

        const deletedDocument = await docsModel.findByIdAndDelete(id)

        if (!deletedDocument) {
            return res.status(404).json({ error: "Document not found" })
        }

        res.status(200).json({ message: "Document deleted successfully" })
    } catch (err) {
        console.error("Error deleting document:", err)
        res.status(500).json({ error: "An error occurred while deleting the document" })
    }
}

module.exports = {
    getAllDocuments,
    getDocumentById,
    addDocument,
    updateDocument,
    deleteDocument,
}
