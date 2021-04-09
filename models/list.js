const mongoose = require("mongoose");

const ListSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    position: {
      type: Number,
      required: true,
    },
    boardId: {
      type: mongoose.Schema.ObjectId,
      ref: "Board",
      required: true,
    },
    cards: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Card",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("List", ListSchema);
