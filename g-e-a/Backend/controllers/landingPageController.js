const LandingPageModel = require("../models/landingPage")

// Get landing page content
exports.getLandingPageContent = async (req, res) => {
    try {
        let landingPage = await LandingPageModel.findOne()

        // If no landing page content exists, create default content
        if (!landingPage) {
            landingPage = await LandingPageModel.create({
                heroTitle: "Global Education Made Accessible",
                heroSubtitle:
                    "Your complete partner in navigating international education. From applications to arrival, we simplify every step of your journey.",
                featuresTitle: "Our Features",
                featuresSubtitle: "Everything you need to start your education journey",
                cardsData: [
                    {
                        title: "Get Help in Documentation",
                        content:
                            "Expert guidance on preparing all required documents for your application. We ensure everything is properly formatted and meets institutional requirements.",
                        image: "/images/Financial.png",
                    },
                    {
                        title: "Find Your Cost",
                        content:
                            "Detailed breakdown of tuition fees, living expenses, and hidden costs. Interactive calculators for accurate financial planning.",
                        image: "/images/BestFit.png",
                    },
                    {
                        title: "Track Your Progress",
                        content:
                            "Monitor your application status in real-time. Stay updated on each step of your journey with our comprehensive tracking system.",
                        image: "/images/financial.jpg",
                    },
                ],
                keyPointsTitle: "Key Study Abroad Factors",
                keyPoints: [
                    "Program Selection",
                    "University Accreditation",
                    "Cost Breakdown",
                    "Visa Process",
                    "Language Requirements",
                    "Cultural Preparation",
                    "Health Insurance",
                    "Housing Options",
                    "Part-time Work",
                    "Safety Measures",
                    "Career Prospects",
                    "Student Support",
                ],
                journeyTitle: "Your Journey With Us",
                journeySubtitle: "We guide you through every step of your international education journey",
                journeySteps: [
                    {
                        label: "Get Your Offer",
                        description: "Receive your acceptance letter from your chosen institution.",
                    },
                    {
                        label: "Arrange Documents",
                        description: "Prepare all necessary documentation for your visa application.",
                    },
                    {
                        label: "Pay Your Fees",
                        description: "Complete payment for tuition and other required fees.",
                    },
                    {
                        label: "Lodge Your Application",
                        description: "Submit your visa application with all supporting documents.",
                    },
                    {
                        label: "Land to Your Destination",
                        description: "Arrive at your destination and begin your educational journey.",
                    },
                ],
                ctaButtonText: "Start Your Journey Today",
                heroImage: "/images/LandingPageBG.png",
                considerationsImage: "/images/thingsToConsider.png",
            })
        }

        res.status(200).json(landingPage)
    } catch (error) {
        console.error("Error fetching landing page content:", error)
        res.status(500).json({ message: "Error fetching landing page content", error: error.message })
    }
}

// Update landing page content
exports.updateLandingPageContent = async (req, res) => {
    try {
        const updatedLandingPage = await LandingPageModel.createOrUpdate(req.body)
        res.status(200).json({ message: "Landing page updated successfully", data: updatedLandingPage })
    } catch (error) {
        console.error("Error updating landing page content:", error)
        res.status(500).json({ message: "Error updating landing page content", error: error.message })
    }
}
