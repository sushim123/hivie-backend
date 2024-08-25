// Define the ApiResponse class to standardize API responses
class ApiResponse {
  // Constructor method to initialize the ApiResponse object
  constructor(statusCode, data, message = 'Success') {
    this.statusCode = statusCode; // The HTTP status code of the response
    this.data = data; // The data payload of the response, can be any type
    this.message = message; // A message describing the response, default is 'Success'
    this.success = statusCode < 400; // Boolean indicating success based on the status code
  }
}

export {ApiResponse};

// Example usage:
// res.send(new ApiResponse(200, response, "Token fetched successfully"));
