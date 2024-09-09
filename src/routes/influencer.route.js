import { Router } from 'express';
import pkg from 'express-openid-connect';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';
const { requiresAuth } = pkg;
import {
  fetchAuthentication,
  fetchAuthenticationAccessToken,
  fetchProfile,
  logout,
} from '../controllers/influencer.controller.js';
const route = Router();
// Route to check if the user is authenticated
route.get('/', asyncHandler(fetchAuthentication));
// Route to fetch an OAuth access token
route.get('/oauth/token', isAuthenticated, asyncHandler(fetchAuthenticationAccessToken));
// Route to log in
route.get('/login', isAuthenticated, (req, res) => {res.oidc.login({ returnTo: '/' });});
// Route to display the user's profile information
route.get('/profile', isAuthenticated, asyncHandler(fetchProfile));

// Route to log out the user, requires the user to be authenticated
route.get('/logout', requiresAuth, asyncHandler(logout));

export default route;
