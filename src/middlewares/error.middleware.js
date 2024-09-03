import {apiError} from '../utils/apiError.util.js'
export const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);
  console.error(`Stack Trace: ${err.stack}`);
  if (err instanceof apiError) {
    // If the error is an instance of apiError, use its details to construct the response
    res.status(err.statusCode).json({
      success: err.success,
      message: err.message,
      errors: err.errors.length ? err.errors : undefined, // Include errors if available
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined // Include stack trace only in development
    });
  } else {
    // For generic errors, return a 500 Internal Server Error
    const genericError = new apiError(500, 'Internal Server Error');
    res.status(500).json({
      success: genericError.success,
      message: genericError.message,
      errors: genericError.errors.length ? genericError.errors : undefined,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

export const notFoundError = (req, res, next) => {
  const errorMessage = `404 Error: The requested URL ${req.originalUrl} was not found on this server.`;
  // Create an apiError object for the 404 error
  const newError = new apiError(404, errorMessage);
  next(newError);
};
