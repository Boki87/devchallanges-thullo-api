const express = require("express");
const { register, login, me, updateMe } = require("../controllers/auth");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(protect, me);
router.route("/").put(protect, updateMe);

module.exports = router;
