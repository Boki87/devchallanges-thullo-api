const express = require("express");
const { uploadFile, updateFile, deleteFile } = require("../controllers/files");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/upload").post(protect, uploadFile);

module.exports = router;
