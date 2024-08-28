// Import necessary modules
import cookieParser from 'cookie-parser'; // Parses cookies attached to the client request object
import cors from 'cors'; // Enables Cross-Origin Resource Sharing (CORS)
import dotenv from 'dotenv'; // Loads environment variables from a .env file
import express from 'express'; // The Express web framework
import {auth} from 'express-openid-connect'; // Auth0 authentication middleware for Express
import session from 'express-session'; // Session management middleware
import http from 'http'; // Built-in Node.js HTTP module for creating the server
import morgan from 'morgan'; // HTTP request logger middleware
import {dirname, join} from 'path'; // Utilities for handling file paths
import {fileURLToPath} from 'url'; // Converts a file URL to a path
import './configs/db.config.js'; // Connect to the MongoDB database
import {config} from './configs/oAuth.config.js'; // OAuth configuration
dotenv.config({path: './.env'}); // Load environment variables

const app = express(); // Create an Express application
const port = process.env.PORT || 4000; // Set the server port

// Middleware setup
// Enable CORS for specified origin and credentials
app.use(cors({origin: process.env.CORS_URL, credentials: true}));

// Use Morgan for logging requests to the console
app.use(morgan('dev'));

// Use Cookie Parser to parse cookies
app.use(cookieParser());

// Parse incoming JSON requests
app.use(express.json());

// Parse URL-encoded data with the querystring library (extended: true uses qs library)
app.use(express.urlencoded({extended: true}));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Set up session management with secret from environment variables
app.use(session({secret: process.env.MY_SECRET, resave: false, saveUninitialized: false}));

// Authentication setup with Auth0
app.use(auth(config));

// View engine setup

// Get the current file path
const __filename = fileURLToPath(import.meta.url);
// Get the directory name of the current module
const __dirname = dirname(__filename);

// Set the directory for view templates
app.set('views', join(__dirname, 'views'));
// Set the view engine to EJS
app.set('view engine', 'ejs');

// Routes

// Import and use index routes
import dropRoutes from './routes/drop.route.js';
import dropLinkRoutes from './routes/dropLink.route.js';
import indexRoutes from './routes/index.route.js';
import instaRoutes from './routes/insta.routes.js';
import {apiError} from './utils/apiError.util.js';
// Use the imported routes

app.use('/', indexRoutes);
app.use('/api/v1/insta', instaRoutes);
app.use('/api/v1/drops', dropRoutes);
app.use('/api/v1/drop-link', dropLinkRoutes);

// 404 handler
app.use((req, res, next) => {
  const errorMessage = `404 Error: The requested URL ${req.originalUrl} was not found on this server.`;
  // Create an apiError object for the 404 error
  const newError = new apiError(404, errorMessage);
  next(newError);
});

// Error handling middleware
app.use((err, req, res, next) => {
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
});

// Start the server
http.createServer(app).listen(port, () => {
  console.log(`Server running on ${config.baseURL}`); // Log the server URL to the console
});
