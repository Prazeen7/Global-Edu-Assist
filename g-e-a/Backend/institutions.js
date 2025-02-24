const mongoose = require('mongoose');

const InstitutionSchema = new mongoose.Schema({
    institution: { type: String, required: true },
    locations: [{ type: String, required: true }],
    average_tuition: { type: String, required: true },
    intakes: [{ type: String, required: true }],
    language_requirements: {
        IELTS: { type: Number, required: true },
        TOEFL: { type: Number, required: true }
    },
    academic_requirements: {
        undergraduate: { type: String, required: true },
        postgraduate: { type: String, required: true }
    }
});

const InstitutionModel = mongoose.model("institutions", InstitutionSchema);

module.exports = InstitutionModel;
