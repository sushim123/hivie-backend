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
import {OAUTH_CONFIG} from './configs/global.config.js'; // OAuth configuration
dotenv.config({path: './.env'}); // Load environment variables

const app = express(); // Create an Express application
const port = process.env.PORT || 4000; // Set the server port

// Middleware setup
app.use(cors({origin: process.env.CORS_URL, credentials: true}));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(session({secret: process.env.SECRET, resave: false, saveUninitialized: false}));
app.use(auth(OAUTH_CONFIG));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Import and use index routes
import dropRoutes from './routes/drop.route.js';
import dropLinkRoutes from './routes/dropLink.route.js';
import indexRoutes from './routes/index.route.js';
import instaRoutes from './routes/insta.routes.js';
import { errorHandler, notFoundError } from './middlewares/error.middleware.js';
// Use the imported routes

app.use('/', indexRoutes);
app.use('/api/v1/insta', instaRoutes);
app.use('/api/v1/drops', dropRoutes);
app.use('/api/v1/drop-link', dropLinkRoutes);

app.use(notFoundError);
app.use(errorHandler);

// Start the server
http.createServer(app).listen(port, () => {
  console.log(`Server running on ${process.env.BASE_URL}`); // Log the server URL to the console
});
