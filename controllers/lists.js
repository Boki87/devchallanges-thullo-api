const Card = require("../models/card");
const List = require("../models/list");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc        Get all lists for board
// @route       GET /api/v1/lists/:id
// @access      Private
exports.getLists = asyncHandler(async (req, res, next) => {
  console.log(req.params);
  const lists = await List.find({ boardId: req.params.id }).populate({
    path: "cards",
    select: "title listId position members coverPhoto labels",
    populate: {
      path: "members",
      select: "name photo",
    },
  });

  res.status(200).json({
    success: true,
    data: lists,
  });
});

// @desc        Create new list
// @route       POST /api/v1/lists
// @access      Private
exports.createList = asyncHandler(async (req, res, next) => {
  const list = await List.create({
    ...req.body,
    createdBy: req.user._id,
  });

  res.status(200).json({
    success: true,
    data: list,
  });
});

// @desc        Delete list
// @route       DELETE /api/v1/lists/:id
// @access      Private
exports.deleteList = asyncHandler(async (req, res, next) => {
  await Card.deleteMany({ listId: req.params.id });

  await List.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    data: null,
  });
});

// @desc        Update list
// @route       PUT /api/v1/lists/:id
// @access      Private
exports.updateList = asyncHandler(async (req, res, next) => {
  const list = await List.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: list,
  });
});
