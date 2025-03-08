const mongoose = require("mongoose");
const Institution = require("./models/institutions"); 

// MongoDB connection string
const MONGO_URI = "mongodb://127.0.0.1:27017/gea";

// Sample data for Australian Catholic University
const sampleInstitution = {
    id: "qut",
    university: "Queensland University of Technology",
    average_tuition: "$28,000 - $40,000 AUD",
    intakes: ["February", "July", "November"],
    language_requirements: {
        IELTS: "6.5",
        TOEFL: "87",
        PTE: "64"
    },
    academic_requirements: {
        undergraduate: "GPA: 3.0+",
        postgraduate: "GPA: 3.0+"
    },
    avatar: "https://www.qut.edu.au/__data/assets/image/0010/104316/logo.png",
    locations: "Brisbane, Queensland, Australia",
    campuses: ["Gardens Point", "Kelvin Grove"],
    overview: "Queensland University of Technology (QUT) is a major Australian university with a global outlook and a 'real-world' focus. With more than 50,000 students, QUT places a strong emphasis on international student integration and job-oriented programs.",
    programs: {
        "Bachelor of Business": {
            id: "BBUS",
            name: "Bachelor of Business",
            Level: "Undergraduate",
            discipline: "Business",
            url: "https://www.qut.edu.au/study/courses/bachelor-of-business",
            duration: "3 years full-time",
            intakes: "February, July",
            Fees_First_Year: "$29,000 AUD",
            CRICOS_Code: "012345B",
            Language_Requirements: {
                IELTS: "6.5",
                TOEFL: "87",
                PTE: "64"
            },
            campuses: "Gardens Point",
            Application_Fee: "AUD 100",
            Funds_Required: "AUD 50,000"
        },
        "Master of Information Technology": {
            id: "MIT",
            name: "Master of Information Technology",
            Level: "Postgraduate",
            discipline: "Information Technology",
            url: "https://www.qut.edu.au/study/courses/master-of-information-technology",
            duration: "2 years full-time",
            intakes: "February, July",
            Fees_First_Year: "$31,000 AUD",
            CRICOS_Code: "076543C",
            Language_Requirements: {
                IELTS: "6.5",
                TOEFL: "90",
                PTE: "64"
            },
            campuses: "Kelvin Grove",
            Application_Fee: "AUD 100",
            Funds_Required: "AUD 55,000"
        },
        "Bachelor of Fine Arts (Film, Screen and New Media)": {
            id: "BFANM",
            name: "Bachelor of Fine Arts (Film, Screen and New Media)",
            Level: "Undergraduate",
            discipline: "Media and Communication",
            url: "https://www.qut.edu.au/study/courses/bachelor-of-fine-arts-film-screen-and-new-media",
            duration: "3 years full-time",
            intakes: "February, July",
            Fees_First_Year: "$28,000 AUD",
            CRICOS_Code: "034567F",
            Language_Requirements: {
                IELTS: "6.5",
                TOEFL: "87",
                PTE: "64"
            },
            campuses: "Kelvin Grove",
            Application_Fee: "AUD 100",
            Funds_Required: "AUD 48,000"
        },
        "Master of Business Administration (MBA)": {
            id: "MBA",
            name: "Master of Business Administration",
            Level: "Postgraduate",
            discipline: "Business",
            url: "https://www.qut.edu.au/study/courses/master-of-business-administration",
            duration: "1.5 years full-time",
            intakes: "February, July",
            Fees_First_Year: "$36,000 AUD",
            CRICOS_Code: "098765D",
            Language_Requirements: {
                IELTS: "6.5",
                TOEFL: "90",
                PTE: "65"
            },
            campuses: "Gardens Point",
            Application_Fee: "AUD 100",
            Funds_Required: "AUD 56,000"
        },
        "Bachelor of Nursing": {
            id: "BNURS",
            name: "Bachelor of Nursing",
            Level: "Undergraduate",
            discipline: "Health and Community",
            url: "https://www.qut.edu.au/study/courses/bachelor-of-nursing",
            duration: "3 years full-time",
            intakes: "February, July",
            Fees_First_Year: "$32,000 AUD",
            CRICOS_Code: "012346A",
            Language_Requirements: {
                IELTS: "7.0",
                TOEFL: "90",
                PTE: "65"
            },
            campuses: "Kelvin Grove",
            Application_Fee: "AUD 100",
            Funds_Required: "AUD 50,000"
        }
    },
    documents: {
        Offer_letter: {
            academic_documents: "Most recent academic transcripts and certificates.",
            passport: "Copy of the information page of your current valid passport.",
            language_test: "Official IELTS, TOEFL, or PTE test results.",
            gap: "Documentation for any gaps in education (if applicable).",
            form: "Completed application form.",
            immigration: "Details of previous visas if studying in Australia before."
        },
        GS_Stage: {},
        Visa_Stage: {}
    },
    scholarships: {
        "International Merit Scholarship": "https://www.qut.edu.au/study/fees-and-scholarships/scholarships/international-merit-scholarship"
    },
    estimate: ["Undergraduate: $28,000 - $35,000 AUD", "Postgraduate: $30,000 - $40,000 AUD"],
    agents: {
        "AECC Global": {
            location: "Kathmandu, Nepal",
            address: "5th Floor, Sunrise Bizz Park, Kamal Pokhari Marg, Charkhal Dillibazar, Kathmandu",
            tel: "+977 1 4411136",
            email: "kathmandu@aeccglobal.com",
            web: "https://www.aeccglobal.com.np",
            avatar: "https://www.aeccglobal.com/images/aecc-global-logo-blue.svg"
        },
        "IDP Education": {
            location: "Kathmandu, Nepal",
            address: "Hattisar, Kathmandu 44600",
            tel: "+977 1 4211800",
            email: "info.nepal@idp.com",
            web: "https://www.idp.com/nepal",
            avatar: "https://www.idp.com/globalassets/images/idp/logos/idp-logo.svg"
        },
        "The Chopras (TC Global)": {
            location: "Kathmandu, Nepal",
            address: "3rd Floor, Chhaya Devi Complex, Amrit Marg, Thamel, Kathmandu",
            tel: "+977 1 4264001",
            email: "nepal@tcglobal.com",
            web: "https://tcglobal.com",
            avatar: "https://tcglobal.com/wp-content/uploads/2020/07/TC_Logo_2020.svg"
        }
    },
    
    bannerImages: [
        "https://www.qut.edu.au/__data/assets/image/0022/567348/campus-banner.jpg",
        "https://www.qut.edu.au/__data/assets/image/0023/567349/learning-space.jpg"
    ]
};



// Connect to MongoDB
mongoose
    .connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("Connected to MongoDB");
        // Insert the sample data
        return Institution.create(sampleInstitution);
    })
    .then(() => {
        console.log("Data seeded successfully");
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error("Error seeding data:", err);
        mongoose.connection.close();
    });