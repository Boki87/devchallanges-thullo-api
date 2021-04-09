const express = require("express");
const {
  getLists,
  createList,
  deleteList,
  updateList,
} = require("../controllers/lists");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/:id").put(protect, updateList);
router.route("/:id").delete(protect, deleteList);
router.route("/:id").get(protect, getLists);
router.route("/").post(protect, createList);

module.exports = router;
