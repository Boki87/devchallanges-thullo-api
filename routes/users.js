const express = require("express");
const { searchUserByEmail } = require("../controllers/users");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").get(protect, searchUserByEmail);

module.exports = router;
