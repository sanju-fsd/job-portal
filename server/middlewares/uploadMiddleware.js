const fs = require("fs");
const path = require("path");
const multer = require("multer");

const CANDIDATE_UPLOAD_DIR = path.join(__dirname, "..", "uploads", "candidates");
const EMPLOYER_UPLOAD_DIR = path.join(__dirname, "..", "uploads", "employers");

const candidateStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdirSync(CANDIDATE_UPLOAD_DIR, { recursive: true });
    cb(null, CANDIDATE_UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const baseName = path
      .basename(file.originalname || "file", ext)
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .slice(0, 40);

    cb(null, `${Date.now()}-${baseName || "file"}${ext}`);
  },
});

const allowedImageMimes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedResumeMimes = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

const fileFilter = (_req, file, cb) => {
  if (file.fieldname === "candidateImage" && allowedImageMimes.has(file.mimetype)) {
    return cb(null, true);
  }

  if (file.fieldname === "resume" && allowedResumeMimes.has(file.mimetype)) {
    return cb(null, true);
  }

  return cb(new Error("Invalid file type"));
};

const upload = multer({
  storage: candidateStorage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter,
});

exports.uploadCandidateAssets = upload.fields([
  { name: "candidateImage", maxCount: 1 },
  { name: "resume", maxCount: 1 },
]);

const employerLogoStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    fs.mkdirSync(EMPLOYER_UPLOAD_DIR, { recursive: true });
    cb(null, EMPLOYER_UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const baseName = path
      .basename(file.originalname || "file", ext)
      .replace(/[^a-zA-Z0-9_-]/g, "")
      .slice(0, 40);

    cb(null, `${Date.now()}-${baseName || "file"}${ext}`);
  },
});

const uploadEmployerLogoInstance = multer({
  storage: employerLogoStorage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.fieldname === "profileImage" && allowedImageMimes.has(file.mimetype)) {
      return cb(null, true);
    }
    return cb(new Error("Invalid file type"));
  },
});

exports.uploadEmployerLogo = uploadEmployerLogoInstance.single("profileImage");
