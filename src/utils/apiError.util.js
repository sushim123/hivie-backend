class apiError extends Error {
  constructor(statusCode, message = 'Something went wrong', errors = [], stack = '', url = '') {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;
    if (stack) {
      this.stack = stack;
    } else if (process.env.NODE_ENV === 'development') {
      Error.captureStackTrace(this, this.constructor);
    }

    if (url) {
      this.url = url;
    }
  }
}

export { apiError };
