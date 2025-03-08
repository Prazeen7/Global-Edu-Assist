const docsModel = require("../models/documents");

const getAllDocuments = async (req, res) => {
    try {
        const documents = await docsModel.find();
        res.json(
            documents.length ? documents : { message: "No documents found" }
        );
    } catch (err) {
        console.error("Error fetching documents:", err); 
        res.status(500).json({ error: "An error occurred while fetching the documents" });
    }
};

module.exports = { getAllDocuments };