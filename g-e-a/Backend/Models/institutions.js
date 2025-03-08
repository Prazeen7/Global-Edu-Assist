const mongoose = require("mongoose");

const InstitutionSchema = new mongoose.Schema({
    id: { type: String },
    university: { type: String, required: true },
    average_tuition: { type: String },
    intakes: [{ type: String }],
    language_requirements: {
        IELTS: { type: Number },
        TOEFL: { type: Number },
        PTE: { type: Number }
    },
    academic_requirements: {
        undergraduate: { type: String },
        postgraduate: { type: String }
    },
    avatar: { type: String },
    locations: { type: String },
    campuses: [{ type: String }],
    overview: { type: String },

    programs: {
        type: Map,
        of: new mongoose.Schema({
            id: { type: String },
            Level: { type: String },
            discipline: { type: String },
            url: { type: String },
            duration: { type: String },
            intakes: { type: String },
            Fees_First_Year: { type: String },
            CRICOS_Code: { type: String },
            Language_Requirements: {
                IELTS: { type: String },
                TOEFL: { type: String },
                PTE: { type: String }
            },
            campuses: { type: String },
            Application_Fee: { type: String },
            Funds_Required: { type: String }
        }, { _id: false })
    },

    documents: {
        Offer_letter: {
            academic_documents: { type: String },
            passport: { type: String },
            language_test: { type: String },
            gap: { type: String },
            form: { type: String },
            immigration: { type: String }
        },
        GS_Stage: { type: Object },
        Visa_Stage: { type: Object }
    },

    scholarships: {
        type: Map,
        of: { type: String }
    },

    estimate: [{ type: String }],

    agents: {
        type: Map,
        of: new mongoose.Schema({
            location: { type: String },
            address: { type: String },
            tel: { type: String },
            email: { type: String },
            web: { type: String },
            avatar: { type: String }
        }, { _id: false })
    },

    bannerImages: [{ type: String }]
});

module.exports = mongoose.model("Institution", InstitutionSchema);
