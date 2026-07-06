const multer = require("multer");
const cloudinary = require("./cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "global-edu-assist", // Folder name in Cloudinary
        allowed_formats: ["jpg", "jpeg", "png", "webp", "jfif"],
        transformation: [{ width: 1500, height: 1500, crop: "limit" }], // Optional: resize images
    },
});

// File filter for allowed types (more flexible)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".jfif"];
    
    // Get file extension from originalname
    const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
    
    // Accept if either MIME type matches OR file extension matches
    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
        cb(null, true);
    } else {
        console.log(`Rejected file: ${file.originalname}, MIME: ${file.mimetype}`);
        cb(new Error(`Invalid file type. Only JPEG/PNG/WEBP images allowed. Got: ${file.mimetype}`), false);
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
}).single("image"); // For profilePicture upload

// Configuration for document uploads
const uploadDocuments = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB per file
        files: 10, // Maximum 10 documents
    },
}).array("documents", 10);

// Error handling middleware
const handleUploadErrors = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        let errorMessage = "File upload error";

        if (err.code === "LIMIT_FILE_SIZE") {
            errorMessage = "File size too large. Maximum 5MB allowed";
        } else if (err.code === "LIMIT_FILE_COUNT") {
            // Customize message based on which upload triggered the error
            if (req.file && req.file.fieldname === "profilePicture") {
                errorMessage = "Only one profile picture allowed";
            } else if (req.files && req.files[0]?.fieldname === "documents") {
                errorMessage = "Maximum 10 documents allowed";
            }
        } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
            errorMessage = "Unexpected field in file upload";
        }

        return res.status(400).json({ success: false, message: errorMessage });
    } else if (err.message && err.message.includes("Invalid file type")) {
        return res.status(400).json({ success: false, message: err.message });
    }
    next(err);
};

module.exports = {
    upload: uploadMultiple,
    uploadSingle,
    uploadDocuments,
    handleUploadErrors,
};