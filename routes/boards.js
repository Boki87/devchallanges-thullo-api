const express = require("express");
const {
  getAllBoardsForUser,
  createBoard,
  updateBoard,
  deleteBoard,
  getBoardForUser,
} = require("../controllers/boards");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.route("/:id").get(protect, getBoardForUser);
router.route("/").get(protect, getAllBoardsForUser);
router.route("/").post(protect, createBoard);
router.route("/:id").put(protect, updateBoard);
router.route("/:id").delete(protect, deleteBoard);

module.exports = router;
