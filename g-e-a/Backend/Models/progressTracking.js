const mongoose = require("mongoose")

// Define a schema for checklist items that can be nested
const checklistItemSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
    },
    label: {
        type: String,
        required: true,
    },
    checked: {
        type: Boolean,
        default: false,
    },
    conditional: {
        type: Boolean,
        default: false,
    },
    applicable: {
        type: Boolean,
        default: true,
    },
    children: {
        type: [mongoose.Schema.Types.Mixed], // Allow for nested items
        default: [],
    },
})

// Schema for progress tracking
const progressTrackingSchema = new mongoose.Schema(
    {
        userId: {
            type: String, // Changed from ObjectId to String
            required: true,
            unique: true,
        },
        userName: {
            type: String,
            required: true,
        },
        stages: {
            offer: {
                items: [checklistItemSchema],
                completed: {
                    type: Number,
                    default: 0,
                },
                total: {
                    type: Number,
                    default: 0,
                },
                percentage: {
                    type: Number,
                    default: 0,
                },
            },
            gs: {
                items: [checklistItemSchema],
                completed: {
                    type: Number,
                    default: 0,
                },
                total: {
                    type: Number,
                    default: 0,
                },
                percentage: {
                    type: Number,
                    default: 0,
                },
            },
            coe: {
                items: [checklistItemSchema],
                completed: {
                    type: Number,
                    default: 0,
                },
                total: {
                    type: Number,
                    default: 0,
                },
                percentage: {
                    type: Number,
                    default: 0,
                },
            },
            visa: {
                items: [checklistItemSchema],
                completed: {
                    type: Number,
                    default: 0,
                },
                total: {
                    type: Number,
                    default: 0,
                },
                percentage: {
                    type: Number,
                    default: 0,
                },
            },
        },
        overallProgress: {
            type: Number,
            default: 0,
        },
        currentStage: {
            type: String,
            enum: ["offer", "gs", "coe", "visa"],
            default: "offer",
        },
        lastUpdated: {
            type: Date,
            default: Date.now,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
        completedAt: {
            type: Date,
            default: null,
        },
    },
    { timestamps: true },
)

// Create default checklist items for each stage
progressTrackingSchema.methods.initializeDefaultChecklists = function () {
    // Offer stage default items
    this.stages.offer.items = [
        {
            id: "passport",
            label: "Passport submitted",
            checked: false,
            children: [
                {
                    id: "old-passport",
                    label: "Old passport (if available)",
                    checked: false,
                    conditional: true,
                    applicable: false,
                },
                {
                    id: "immigration-history",
                    label: "Disclose all immigration history",
                    checked: false,
                    conditional: true,
                    applicable: false,
                },
            ],
        },
        {
            id: "academic-docs",
            label: "Academic Documents submitted",
            checked: false,
        },
        {
            id: "cv",
            label: "CV",
            checked: false,
        },
        {
            id: "english-test",
            label: "English Proficiency Test Score (if any)",
            checked: false,
            conditional: true,
            applicable: false,
        },
        {
            id: "work-experience",
            label: "Work experience/Internships (if any)",
            checked: false,
            conditional: true,
            applicable: false,
        },
        {
            id: "application-form",
            label: "Application form (If any)",
            checked: false,
            conditional: true,
            applicable: false,
        },
        {
            id: "gs-statement",
            label: "GS statement (If any)",
            checked: false,
            conditional: true,
            applicable: false,
        },
    ]

    // GS stage default items
    this.stages.gs.items = [
        {
            id: "relationship-verification",
            label: "Relationship verification Documents",
            checked: false,
        },
        {
            id: "ward-tax-clearance",
            label: "Ward Tax Clearance Documents",
            checked: false,
        },
        {
            id: "income",
            label: "Income",
            checked: false,
            children: [
                {
                    id: "ward-income-verification",
                    label: "Ward Income Verification Certificates",
                    checked: false,
                },
                {
                    id: "salary",
                    label: "Salary (if any)",
                    checked: false,
                    conditional: true,
                    applicable: false,
                    children: [
                        {
                            id: "salary-certificate",
                            label: "Salary Certificate",
                            checked: false,
                        },
                        {
                            id: "tax-clearance-3-years",
                            label: "Tax Clearance Certificate of past 3 years",
                            checked: false,
                        },
                        {
                            id: "salary-statement",
                            label: "1 year salary statement",
                            checked: false,
                        },
                        {
                            id: "pan-card",
                            label: "Pan Card",
                            checked: false,
                        },
                    ],
                },
                {
                    id: "rent-lease",
                    label: "Rent/Lease (if any)",
                    checked: false,
                    conditional: true,
                    applicable: false,
                    children: [
                        {
                            id: "agreement-paper",
                            label: "Agreement Paper",
                            checked: false,
                        },
                        {
                            id: "rent-tax-receipt",
                            label: "Rent/Lease Tax Receipt",
                            checked: false,
                        },
                        {
                            id: "rent-statement",
                            label: "Rent/Lease statement",
                            checked: false,
                        },
                        {
                            id: "tenant-citizenship",
                            label: "Tenant Citizenship",
                            checked: false,
                        },
                        {
                            id: "land-ownership",
                            label: "Land Ownership Certificate",
                            checked: false,
                        },
                        {
                            id: "land-tax-receipt",
                            label: "Land Tax Receipt",
                            checked: false,
                        },
                    ],
                },
                {
                    id: "business",
                    label: "Business (if any)",
                    checked: false,
                    conditional: true,
                    applicable: false,
                    children: [
                        {
                            id: "business-registration",
                            label: "Business Registration Certificate",
                            checked: false,
                        },
                        {
                            id: "pan-vat-registration",
                            label: "PAN/VAT registration",
                            checked: false,
                        },
                        {
                            id: "business-tax-clearance",
                            label: "Tax Clearance Certificate of past 3 years",
                            checked: false,
                        },
                        {
                            id: "business-salary-statement",
                            label: "1 year salary statement",
                            checked: false,
                        },
                    ],
                },
                {
                    id: "vehicle",
                    label: "Vehicle (if any)",
                    checked: false,
                    conditional: true,
                    applicable: false,
                    children: [
                        {
                            id: "vehicle-registration",
                            label: "Vehicle registration documents",
                            checked: false,
                        },
                        {
                            id: "vehicle-road-tax",
                            label: "Vehicle road tax documents",
                            checked: false,
                        },
                        {
                            id: "vehicle-agreement",
                            label: "Agreement letter if private",
                            checked: false,
                        },
                        {
                            id: "transport-association-letter",
                            label: "Letter from Transport association if public vehicle",
                            checked: false,
                        },
                        {
                            id: "vehicle-insurance",
                            label: "Vehicle insurance documents",
                            checked: false,
                        },
                    ],
                },
                {
                    id: "pension",
                    label: "Pension (if any)",
                    checked: false,
                    conditional: true,
                    applicable: false,
                    children: [
                        {
                            id: "pension-book",
                            label: "Pension Book",
                            checked: false,
                        },
                        {
                            id: "pension-bank-statement",
                            label: "Bank statement of 1 year",
                            checked: false,
                        },
                    ],
                },
                {
                    id: "agriculture",
                    label: "Agriculture (if any)",
                    checked: false,
                    conditional: true,
                    applicable: false,
                    children: [
                        {
                            id: "ward-letter",
                            label: "Letter from ward declaring it as source of income and tax this source is tax free",
                            checked: false,
                        },
                        {
                            id: "sales-receipts",
                            label: "Sales receipts",
                            checked: false,
                        },
                    ],
                },
                {
                    id: "foreign-employment",
                    label: "Foreign Employment (if any)",
                    checked: false,
                    conditional: true,
                    applicable: false,
                    children: [
                        {
                            id: "salary-letter",
                            label: "Salary letter",
                            checked: false,
                        },
                        {
                            id: "foreign-passport",
                            label: "Passport",
                            checked: false,
                        },
                        {
                            id: "visa",
                            label: "Visa",
                            checked: false,
                        },
                        {
                            id: "foreign-statement",
                            label: "1 year statement",
                            checked: false,
                        },
                        {
                            id: "foreign-tax-documents",
                            label: "Tax documents",
                            checked: false,
                        },
                    ],
                },
            ],
        },
        {
            id: "birth-certificates",
            label: "Birth Certificates",
            checked: false,
        },
        {
            id: "citizenships",
            label: "Applicant's and Sponsor's Citizenships",
            checked: false,
        },
        {
            id: "bank-loan-balance",
            label: "Bank loan / Bank Balance related documents",
            checked: false,
            children: [
                {
                    id: "bank-loan",
                    label: "Bank Loan (if any)",
                    checked: false,
                    conditional: true,
                    applicable: false,
                    children: [
                        {
                            id: "mortgage-deed",
                            label: "Mortgage Deed",
                            checked: false,
                        },
                        {
                            id: "loan-sanction-letter",
                            label: "Loan Sanction Letter",
                            checked: false,
                        },
                        {
                            id: "loan-land-ownership",
                            label: "Land Ownership Certificates",
                            checked: false,
                        },
                        {
                            id: "loan-land-tax",
                            label: "Land Tax Receipt",
                            checked: false,
                        },
                        {
                            id: "bank-valuation-letter",
                            label: "Bank Valuation Letter",
                            checked: false,
                        },
                    ],
                },
                {
                    id: "bank-balance",
                    label: "Bank balance (if any)",
                    checked: false,
                    conditional: true,
                    applicable: false,
                    children: [
                        {
                            id: "balance-certificate",
                            label: "Bank Balance Certificate",
                            checked: false,
                        },
                        {
                            id: "balance-source",
                            label: "Source of balance",
                            checked: false,
                        },
                    ],
                },
            ],
        },
        {
            id: "land-ownership-certificates",
            label: "Land Ownership Certificates",
            checked: false,
        },
        {
            id: "land-tax-receipt",
            label: "Land Tax Receipt past 3 years",
            checked: false,
        },
        {
            id: "property-valuation",
            label: "Property Valuation Letter",
            checked: false,
        },
        {
            id: "ca-report",
            label: "CA Report",
            checked: false,
        },
        {
            id: "gs-statements",
            label: "GS Statements",
            checked: false,
        },
        {
            id: "gs-forms",
            label: "GS Forms",
            checked: false,
        },
        {
            id: "offer-acceptance",
            label: "Offer acceptance",
            checked: false,
        },
        {
            id: "under-18-documents",
            label: "Under 18 documents (if any)",
            checked: false,
            conditional: true,
            applicable: false,
            children: [
                {
                    id: "guardianship-proof",
                    label: "Guardianship proof",
                    checked: false,
                },
                {
                    id: "police-report",
                    label: "Police report",
                    checked: false,
                },
                {
                    id: "applicant-id",
                    label: "Applicant's ID",
                    checked: false,
                },
            ],
        },
    ]

    // COE stage default items
    this.stages.coe.items = [
        {
            id: "swift-copy",
            label: "Swift Copy of paid tuition fee",
            checked: false,
        },
        {
            id: "disbursement-letter",
            label: "Disbursement letter / Loan Account statement after fee payment if bank loan",
            checked: false,
            conditional: true,
            applicable: false,
        },
        {
            id: "oshc",
            label: "Overseas Student Health Cover (OSHC)",
            checked: false,
        },
    ]

    // Visa stage default items
    this.stages.visa.items = [
        {
            id: "confirmation-enrollment",
            label: "Confirmation of Enrollment letter",
            checked: false,
        },
        {
            id: "visa-application-form",
            label: "Visa application form",
            checked: false,
        },
        {
            id: "medical-test",
            label: "Medical Test",
            checked: false,
        },
        {
            id: "biometric",
            label: "Biometric",
            checked: false,
        },
    ]

    // Calculate initial totals
    this.calculateTotals()
}

// Function to count items recursively
const countItemsRecursively = (items, counts) => {
    for (const item of items) {
        if (!item.conditional || item.applicable) {
            counts.total++
            if (item.checked) counts.completed++
        }

        if (item.children && item.children.length > 0) {
            countItemsRecursively(item.children, counts)
        }
    }
    return counts
}

// Calculate totals for each stage
progressTrackingSchema.methods.calculateTotals = function () {
    const stages = ["offer", "gs", "coe", "visa"]

    let overallCompleted = 0
    let overallTotal = 0

    stages.forEach((stageName) => {
        const stage = this.stages[stageName]

        // Count items recursively
        const counts = countItemsRecursively(stage.items, { completed: 0, total: 0 })

        stage.completed = counts.completed
        stage.total = counts.total
        stage.percentage = counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0

        overallCompleted += counts.completed
        overallTotal += counts.total
    })

    this.overallProgress = overallTotal > 0 ? Math.round((overallCompleted / overallTotal) * 100) : 0
    this.lastUpdated = new Date()
}

const ProgressTracking = mongoose.model("ProgressTracking", progressTrackingSchema)

module.exports = ProgressTracking
