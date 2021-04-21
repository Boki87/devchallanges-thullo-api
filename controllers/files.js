const fs = require("fs");
const fileType = require("file-type");
const multiparty = require("multiparty");

const File = require("../models/file");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const uploadFile = require("../utils/uploadFile");

// @desc        Upload File to s3
// @route       POST /api/v1/files/upload
// @access      Private
exports.uploadFile = asyncHandler(async (req, res, next) => {
  const form = new multiparty.Form();

  form.parse(
    req,
    asyncHandler(async (error, fields, files) => {
      if (error) {
        return next(new ErrorResponse(`${error}`));
      }
      console.log(1111, files);
      try {
        const path = files.file[0].path;
        const buffer = fs.readFileSync(path);
        const type = await fileType.fromBuffer(buffer);
        const fileName = `attachments/${Date.now().toString()}`;
        const data = await uploadFile(buffer, fileName, type);

        return res.status(200).json({
          success: true,
          data: data,
        });
      } catch (err) {
        return next(new ErrorResponse(`${err}`));
      }
    })
  );
});
