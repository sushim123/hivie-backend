import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { auth } from 'express-openid-connect';
import session from 'express-session';
import http from 'http';
import morgan from 'morgan';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import './configs/db.config.js';
import { OAUTH_CONFIG } from './configs/global.config.js';
import { errorHandler, notFoundError } from './middlewares/error.middleware.js';

dotenv.config({ path: './.env' });

const app = express();
const port = process.env.PORT || 4000;

// Middleware setup
app.use(cors({ origin: process.env.CORS_URL, credentials: true }));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: false }));
app.use(auth(OAUTH_CONFIG));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.set('views', join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Import and use routes
import dropRoutes from './routes/drop.route.js';
import dropLinkRoutes from './routes/dropLink.route.js';
import indexRoutes from './routes/index.route.js';
import instaRoutes from './routes/insta.routes.js';
import ecommerceRoutes from './routes/e_commerce.route.js'
app.use('/', indexRoutes);
app.use('/api/v1/insta', instaRoutes);
app.use('/api/v1/drops', dropRoutes);
app.use('/api/v1/drop-link', dropLinkRoutes);
app.use('/api/v1/e-commerce', ecommerceRoutes);

// Error handling middleware
app.use(notFoundError);
app.use(errorHandler);

// Start the server
http.createServer(app).listen(port, () => {
  console.log(`Server running on ${process.env.BASE_URL}`);
});
