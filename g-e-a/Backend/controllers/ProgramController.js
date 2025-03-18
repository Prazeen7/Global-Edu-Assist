const InstitutionModel = require("../models/institutions");

const getAllPrograms = async (req, res) => {
    try {
        const {
            search,
            location,
            gpa,
            englishTest,
            testScore,
            academicLevel,
            fieldOfStudy,
            preferredLocation,
            studyGap,
            workExperience,
            visaRefusal,
            sortOrder,
            page = 1,
            limit = 6,
        } = req.query;

        // Build the query object
        const query = {};

        // Search by university name
        if (search) {
            query.university = { $regex: search, $options: 'i' };
        }

        // Filter by GPA
        if (gpa) {
            query["academic_requirements.undergraduate"] = { $lte: parseFloat(gpa) };
            query["academic_requirements.postgraduate"] = { $lte: parseFloat(gpa) };
        }

        // Filter by English test and score
        if (englishTest && testScore) {
            query[`programs.Language_Requirements.${englishTest.toUpperCase()}`] = { $gte: parseFloat(testScore) };
        }

        // Filter by academic level
        if (academicLevel) {
            query["programs.Level"] = academicLevel === "high_school" ? "Undergraduate" : "Graduate";
        }

        // Filter by field of study
        if (fieldOfStudy) {
            query["programs.discipline"] = { $regex: fieldOfStudy, $options: 'i' };
        }

        // Filter by preferred location
        if (preferredLocation) {
            query.locations = { $regex: preferredLocation, $options: 'i' };
        }

        // Filter by study gap
        if (studyGap) {
            query["programs.studyGap"] = { $lte: parseFloat(studyGap) };
        }

        // Filter by work experience
        if (workExperience) {
            query["programs.workExperience"] = { $lte: parseFloat(workExperience) };
        }

        // Filter by visa refusal
        if (visaRefusal) {
            query["programs.visaRefusal"] = visaRefusal === "true";
        }

        // Fetch institutions based on the query
        const institutions = await InstitutionModel.find(query);

        // Sort institutions by fees if sortOrder is provided
        let sortedInstitutions = institutions;
        if (sortOrder) {
            sortedInstitutions = institutions.sort((a, b) => {
                const feeA = parseFloat(a.programs.Fees_First_Year?.replace(/[^0-9.]/g, "")) || 0;
                const feeB = parseFloat(b.programs.Fees_First_Year?.replace(/[^0-9.]/g, "")) || 0;
                return sortOrder === "highToLow" ? feeB - feeA : feeA - feeB;
            });
        }

        // Pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedInstitutions = sortedInstitutions.slice(startIndex, endIndex);

        if (paginatedInstitutions.length === 0) {
            return res.status(404).json({
                message: [
                    "No institutions found matching your criteria.",
                    "Try adjusting your search or filters to see more results."
                ]
            });
        }

        res.json({
            total: sortedInstitutions.length,
            page: parseInt(page),
            limit: parseInt(limit),
            institutions: paginatedInstitutions,
        });
    } catch (err) {
        console.error("Error fetching institutions:", err);
        res.status(500).json({ error: "An error occurred while fetching the institutions" });
    }
};

module.exports = { getAllPrograms };