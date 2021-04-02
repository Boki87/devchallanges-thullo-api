const mongoose = require("mongoose");

const BoardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    coverPhoto: {
      type: String,
      default: "",
    },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    description: {
      type: String,
      default: "",
    },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Board", BoardSchema);
