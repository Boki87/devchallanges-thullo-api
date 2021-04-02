const User = require("../models/user");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc        Search for users by email
// @route       GET /api/v1/users?email=example@email.com
// @access      Private
exports.searchUserByEmail = asyncHandler(async (req, res, next) => {
  if (!req.query.email) {
    return next(
      new ErrorResponse(`Please provide an email to search for`, 404)
    );
  }

  const user = await User.find({ email: req.query.email });

  res.status(200).json({
    success: true,
    data: user,
  });
});
