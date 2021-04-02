const User = require("../models/user");
const Board = require("../models/board");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc        Get single board where user is member or owner
// @route       GET /api/v1/board
// @access      Private
exports.getBoardForUser = asyncHandler(async (req, res, next) => {
  const user = req.user;

  const board = await Board.findById(req.params.id)
    .populate({
      path: "members",
      select: "name photo email",
    })
    .populate({ path: "createdBy", select: "name photo email" });

  //check if user is creator or member of board
  if (
    user._id.toString() !== board.createdBy._id.toString() &&
    board.members.filter((m) => m._id === user._id.toString()).length > 0
  ) {
    return next(
      new ErrorResponse(
        `You don't have permission to see data for this board`,
        401
      )
    );
  }

  res.status(200).json({
    success: true,
    data: board,
  });
});

// @desc        Get all boards where user is member or owner
// @route       GET /api/v1/boards
// @access      Private
exports.getAllBoardsForUser = asyncHandler(async (req, res, next) => {
  const user = req.user;

  const boards = await Board.find({
    $or: [
      { createdBy: user._id },
      //   { members: { $elemMatch: { $eq: user._id } } },
      { members: user._id },
    ],
  })
    .populate({
      path: "members",
      select: "name photo email",
    })
    .populate({ path: "createdBy", select: "name photo email" });
  res.status(200).json({
    success: true,
    data: boards,
  });
});

// @desc        Create Board
// @route       POST /api/v1/boards
// @access      Private
exports.createBoard = asyncHandler(async (req, res, next) => {
  const user = req.user;
  const { name, coverPhoto } = req.body;

  if (!name) {
    return next(new ErrorResponse(`Please add name for the board`, 500));
  }

  //create board
  const board = await Board.create({
    name,
    coverPhoto,
    createdBy: user._id,
  });

  res.status(200).json({
    success: true,
    data: board,
  });

  //   sendTokenResponse(user, 200, res);
});

// @desc        Update Board
// @route       PUT /api/v1/boards/:id
// @access      Private
exports.updateBoard = asyncHandler(async (req, res, next) => {
  const user = req.user;

  let board = await Board.findById(req.params.id);

  if (!board) {
    return next(new ErrorResponse(`No board with id ${re.params.id}`, 404));
  }

  //check if user is owner or member of board
  if (
    board.createdBy.toString() !== req.user._id.toString() &&
    !board.members.includes(req.user._id.toString())
  ) {
    return next(
      new ErrorResponse(
        `User ${user._id} does not have permission to update this board`,
        401
      )
    );
  }

  //update board
  board = await Board.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: board,
  });

  //   sendTokenResponse(user, 200, res);
});

// @desc        Delete Board
// @route       DELETE /api/v1/boards/:id
// @access      Private
exports.deleteBoard = asyncHandler(async (req, res, next) => {
  const user = req.user;

  let board = await Board.findById(req.params.id);

  if (!board) {
    return next(new ErrorResponse(`No board with id ${re.params.id}`, 404));
  }

  //check if user is owner or member of board
  if (
    board.createdBy.toString() !== req.user._id.toString() &&
    !board.members.includes(req.user._id.toString())
  ) {
    return next(
      new ErrorResponse(
        `User ${user._id} does not have permission to delete this board`,
        401
      )
    );
  }

  //delete board
  board.remove();

  res.status(200).json({
    success: true,
    data: {},
  });

  //   sendTokenResponse(user, 200, res);
});
