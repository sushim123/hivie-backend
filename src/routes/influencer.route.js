import { Router } from 'express';
import pkg from 'express-openid-connect';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';
const { requiresAuth } = pkg;
import {
  fetchAuthenticationInfluencer,
  fetchInfluenderAuthenticationAccessToken,
  fetchProfileOfInfluencer,
  logoutInfluender,
} from '../controllers/influencer.controller.js';
const route = Router();
// Route to check if the user is authenticated
route.get('/', asyncHandler(fetchAuthenticationInfluencer));
// Route to fetch an OAuth access token
route.get('/oauth/token', isAuthenticated, asyncHandler(fetchInfluenderAuthenticationAccessToken));
// Route to log in
route.get('/login', isAuthenticated, (req, res) => {res.oidc.login({ returnTo: 'https://hivie-backend-ewk0.onrender.com/' });});
// Route to display the user's profile information
route.get('/profile', isAuthenticated, asyncHandler(fetchProfileOfInfluencer) );
// Route to log out the user, requires the user to be authenticated
route.get('/logout', requiresAuth, asyncHandler(logoutInfluender ));
export default route;
