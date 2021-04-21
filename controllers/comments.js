const Comment = require("../models/comment");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc        Create new comment
// @route       POST /api/v1/comments
// @access      Private
exports.createComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.create({
    ...req.body,
    createdBy: req.user._id,
  });

  let populatedComment = await Comment.findById(comment._id).populate({
    path: "createdBy",
    select: "name photo",
  });

  res.status(200).json({
    success: true,
    data: populatedComment,
  });
});

// @desc        Update Comment
// @route       PUT /api/v1/comments/:id
// @access      Private
exports.updateComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).populate({
    path: "createdBy",
    select: "name photo",
  });

  res.status(200).json({
    success: true,
    data: comment,
  });
});

// @desc        Delete Comment
// @route       DELETE /api/v1/cards/:id
// @access      Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: null,
  });
});
