const mongoose = require("mongoose");
//
const CommentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    cardId: {
      type: mongoose.Schema.ObjectId,
      ref: "Card",
      required: [true, "Card Id is required to create a comment"],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
