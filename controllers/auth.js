const User = require("../models/user");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc        Update logged in user
// @route       PUT /api/v1/auth
// @access      Private
exports.updateMe = asyncHandler(async (req, res, next) => {
  const { password, ...restOfProps } = req.body;

  const updatedMe = await User.findOneAndUpdate(
    { _id: req.user._id },
    restOfProps,
    {
      new: true,
      runValidators: true,
    }
  );

  if (req.body.password) {
    const user = await User.findById(req.user._id).select("+password");
    user.password = req.body.password;
    await user.save();

    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      data: user,
      token: token,
    });
  } else {
    res.status(200).json({
      success: true,
      data: updatedMe,
    });
  }
});

// @desc        Register user
// @route       POST /api/v1/auth/register
// @access      Public
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!email || !password || !name) {
    return next(
      new ErrorResponse(`Please provide an email, name and password`, 400)
    );
  }

  const userCheck = await User.findOne({ email });

  if (userCheck) {
    return next(new ErrorResponse(`Email already taken!`, 400));
  }
  //create user
  const user = await User.create({
    name,
    email,
    password,
  });

  sendTokenResponse(user, 200, res);
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //validate email and password
  if (!email || !password) {
    return next(new ErrorResponse(`Please provide an email and password`, 400));
  }

  //check for user
  const user = await User.findOne({ email }).select("+password"); // using + to override default select: false on model

  if (!user) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }

  //check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse(`Invalid credentials`, 401));
  }

  sendTokenResponse(user, 200, res);
});

// @desc        Get current logged in user
// @route       GET /api/v1/auth/me
// @access      Private
exports.me = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

//get token from model, create token and send response
const sendTokenResponse = (user, statusCode, res) => {
  //create token
  const token = user.getSignedJwtToken();

  res.status(statusCode).json({
    success: true,
    token,
  });
};
