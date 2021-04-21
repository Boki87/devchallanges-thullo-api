const mongoose = require("mongoose");

const LabelSchema = new mongoose.Schema({
  title: String,
  color: String,
});

const AttachmentSchema = new mongoose.Schema({
  name: String,
  url: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const CardSchema = new mongoose.Schema(
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
    listId: {
      type: mongoose.Schema.ObjectId,
      ref: "List",
    },
    description: {
      type: String,
      default: "",
    },
    members: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    coverPhoto: {
      type: String,
      default: "",
    },
    labels: [LabelSchema],
    attachments: [AttachmentSchema],
    comments: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Comment",
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Card", CardSchema);
