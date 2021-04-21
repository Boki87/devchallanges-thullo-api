const express = require("express");
const {
  createComment,
  deleteComment,
  updateComment,
} = require("../controllers/comments");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(protect, createComment);
router.route("/:id").put(protect, updateComment);
router.route("/:id").delete(protect, deleteComment);

module.exports = router;
