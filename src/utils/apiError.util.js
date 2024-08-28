/**
 * Custom error class for API errors.
 * @extends Error
 */
class apiError extends Error {
  /**
   * @param {number} statusCode - HTTP status code for the error.
   * @param {string} [message='Something went wrong'] - Custom error message.
   * @param {Array} [errors=[]] - Array of detailed error information.
   * @param {string} [stack=''] - Optional custom stack trace.
   */
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

export {apiError};
