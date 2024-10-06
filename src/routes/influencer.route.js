import {Router} from 'express';
import pkg from 'express-openid-connect';
import {
  fetchAuthenticationInfluencer,
  fetchInfluencerAuthenticationAccessToken,
  fetchProfileOfInfluencer,
  logoutInfluencer
} from '../controllers/influencer.controller.js';
import {isAuthenticated} from '../middlewares/auth.middleware.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';
const {requiresAuth} = pkg;
const route = Router();
// Route to check if the user is authenticated
route.get('/', asyncHandler(fetchAuthenticationInfluencer));

// Route to fetch an OAuth access token
route.get('/oauth/token', isAuthenticated, asyncHandler(fetchInfluencerAuthenticationAccessToken));
// Route to log in
route.get('/api/login', isAuthenticated, (req, res) => {
  res.oidc.login({returnTo : '/profile'})
  console.log(req.appSession);
  console.log(res.appSession);
});

// Route to display the user's profile information
route.get('/profile', isAuthenticated, asyncHandler(fetchProfileOfInfluencer));
// Route to log out the user, requires the user to be authenticated
route.get('/logout', requiresAuth, asyncHandler(logoutInfluencer));


export default route;
