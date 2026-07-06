const mongoose = require("mongoose");

const institutionSchema = new mongoose.Schema({
    institutionName: { type: String, required: true },
    institutionType: { type: String, required: true },
    profilePicture: String,
    bannerImages: [String],
    overview: {
        heading: String,
        details: String,
    },
    locations: [{
        campusName: String,
        country: String,
        city: String,
        address: String,
    }],
    applicationFee: String,
    programs: [{
        name: String,
        level: String,
        url: String,
        duration: String,
        intakes: String,
        firstYearFees: String,
        cricosCode: String,
        discipline: String,
        campuses: String,
        fundsRequired: String,
        ielts: String,
        pte: String,
        toefl: String,
    }],
    scholarships: [{
        name: String,
        link: String,
    }],
    entryRequirements: {
        undergraduate: {
            GPA: String,
            IELTS: String,
            PTE: String,
            TOEFL: String,
        },
        postgraduate: {
            GPA: String,
            IELTS: String,
            PTE: String,
            TOEFL: String,
        },
    },
    documents: {
        incomeSources: [String],
        sponsors: [String],
        minSponsorCount: String,
        minIncomeAmount: String,
        banks: [String],
        previousVisaRefusal: String,
        levelChangeAfterRefusal: Boolean,
    },
    agents: [String],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Institution", institutionSchema);