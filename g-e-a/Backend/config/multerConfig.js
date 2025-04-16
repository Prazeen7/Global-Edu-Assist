const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set upload directory and create if it doesn't exist
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});

// File filter for allowed types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    const allowedExtensions = [".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname).toLowerCase();

    if (
        allowedTypes.includes(file.mimetype) &&
        allowedExtensions.includes(ext)
    ) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type. Only JPEG/PNG/JPG allowed"), false);
    }
};

// Create multiple upload configurations
const uploadMultiple = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 6, // 1 profile + 5 banners
    },
}).fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "bannerImages", maxCount: 5 },
]);

const uploadSingle = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
}).single("image");

// Error handling middleware
const handleUploadErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                error: "File size too large. Maximum 5MB allowed",
            });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                error: "Too many files uploaded. Maximum 5 banner images allowed",
            });
        }
        if (err.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                error: "Unexpected field in file upload",
            });
        }
    } else if (err.message.includes("Invalid file type")) {
        return res.status(400).json({
            error: err.message,
        });
    }
    next(err);
};

module.exports = { 
    upload: uploadMultiple, 
    uploadSingle, 
    handleUploadErrors 
};