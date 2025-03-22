// config/multerConfig.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

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

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    allowedTypes.includes(file.mimetype)
        ? cb(null, true)
        : cb(new Error("Invalid file type. Only JPEG/PNG/JPG allowed"), false);
};

// Configure upload with fields
const upload = multer({
    storage,
    fileFilter,
}).fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "bannerImages", maxCount: 5 },
]);

module.exports = upload; 