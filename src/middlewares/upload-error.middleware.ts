import type { ErrorRequestHandler } from "express";
import multer from "multer";

const uploadErrorMessages: Partial<Record<multer.ErrorCode, string>> = {
  LIMIT_FILE_SIZE: "File must not exceed 10 MB",
  LIMIT_FILE_COUNT: "A maximum of 5 images can be uploaded",
  LIMIT_UNEXPECTED_FILE: "Only image files are allowed",
};

/** Converts Multer upload errors into a consistent client response. */
const handleUploadError: ErrorRequestHandler = (error, req, res, next) => {
  if (!(error instanceof multer.MulterError)) {
    next(error);
    return;
  }

  res.status(400).json({
    error: req.t("uploadError"),
    message: uploadErrorMessages[error.code] ?? error.message,
  });
};

export default handleUploadError;
