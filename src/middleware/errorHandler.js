import { ApiError } from "../utils/apiError.js";

export const errorHandler = (err, req, res, next) => {
  // Joi validation errors (extra safety)
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: err.message,
    });
  }

  // Custom ApiError
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
    });
  }

  console.error("🔥 ERROR STACK:", err.stack);
  console.error("🔥 ERROR MESSAGE:", err.message);

  // Fallback (unknown errors)
  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: "Internal Server Error",
  });
};
