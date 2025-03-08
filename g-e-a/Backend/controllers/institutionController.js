const InstitutionModel = require("../models/institutions");

const getAllInstitutions = async (req, res) => {
    try {
        const { search, location } = req.query;

        // Build the query object
        const query = {};
        if (search) {
            query.university = { $regex: search, $options: 'i' };
        }
        if (location && location !== "all") {
            query.locations = { $regex: location, $options: 'i' };
        }

        const institutions = await InstitutionModel.find(query);

        if (institutions.length === 0) {
            return res.status(404).json({
                message: [
                    "No institutions found matching your criteria.",
                    "Try adjusting your search or filters to see more results."
                ]
            });
        }

        res.json(institutions);
    } catch (err) {
        console.error("Error fetching institutions:", err);
        res.status(500).json({ error: "An error occurred while fetching the institutions" });
    }
};

module.exports = { getAllInstitutions };