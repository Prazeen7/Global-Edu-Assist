const mongoose = require("mongoose")

const CardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
})

const JourneyStepSchema = new mongoose.Schema({
    label: { type: String, required: true },
    description: { type: String, required: true },
})

const LandingPageSchema = new mongoose.Schema({
    heroTitle: { type: String, required: true },
    heroSubtitle: { type: String, required: true },
    heroImage: { type: String },
    featuresTitle: { type: String, required: true },
    featuresSubtitle: { type: String, required: true },
    cardsData: [CardSchema],
    keyPointsTitle: { type: String, required: true },
    keyPoints: [String],
    journeyTitle: { type: String, required: true },
    journeySubtitle: { type: String, required: true },
    journeySteps: [JourneyStepSchema],
    ctaButtonText: { type: String, required: true },
    considerationsImage: { type: String },
    updatedAt: { type: Date, default: Date.now },
})

// Create or update landing page content
LandingPageSchema.statics.createOrUpdate = async function (landingPageData) {
    // Find the first document (there should only be one)
    const existingPage = await this.findOne()

    if (existingPage) {
        // Update existing document
        Object.assign(existingPage, landingPageData)
        existingPage.updatedAt = Date.now()
        return await existingPage.save()
    } else {
        // Create new document
        return await this.create({
            ...landingPageData,
            updatedAt: Date.now(),
        })
    }
}

const LandingPageModel = mongoose.model("landingPage", LandingPageSchema)
module.exports = LandingPageModel
