const express = require("express");
const {
  getCard,
  createCard,
  updateCard,
  deleteCard,
  reorderCards,
} = require("../controllers/cards");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/reorder").put(protect, reorderCards);
router.route("/").post(protect, createCard);
router.route("/:id").get(protect, getCard);
router.route("/:id").put(protect, updateCard);
router.route("/:id").delete(protect, deleteCard);

module.exports = router;
