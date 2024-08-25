class ApiError extends Error {
  constructor(statusCode, message = 'Something went wrong', errors = [], stack = '') {
    super(message); // Initialize the Error with a message
    this.statusCode = statusCode; // HTTP status code
    this.data = null; // Placeholder for additional data, null for security
    this.message = message; // Custom message for the error
    this.success = false; // Indicates that the operation was not successful
    this.errors = errors; // Array of specific errors or details
    if (stack) {
      this.stack = stack; // Use provided stack trace if available
    } else {
      Error.captureStackTrace(this, this.constructor); // Capture stack trace if not provided
    }
  }
}

export {ApiError};

//SYNTAX TO USE ERRORS:

// throw new ApiError(
//   400,
//   'Invalid request parameters',
//   [{ field: 'id', message: 'ID must be a positive integer'}],
// );
