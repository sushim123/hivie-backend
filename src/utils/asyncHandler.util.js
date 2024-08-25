// Define a function named asyncHandler to wrap asynchronous route handlers
const asyncHandler = (requestHandler) => {
  // Return a new function that takes req, res, and next as arguments
  return (req, res, next) => {
    // Resolve the promise returned by the request handler and catch any errors
    Promise.resolve(requestHandler(req, res, next)).catch(next); // Pass any caught errors to the next middleware (error handler)
  };
};

export {asyncHandler};

// Example breakdown of similar patterns:

// Basic empty function declaration
// const asyncHandler = () => {}

// Function that accepts a parameter and returns an empty function
// const asyncHandler = (func) => () => {}

// Function that accepts a parameter and returns an asynchronous function
// const asyncHandler = (func) => async () => {}

// Full pattern that handles errors within an async function and sends a response
// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message: err.message
//         })
//     }
// }
