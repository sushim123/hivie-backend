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
/**
 * @swagger
 * /:
 *   get:
 *     summary: Check if the user is authenticated
 *     tags: [Influencer]
 *     responses:
 *       200:
 *         description: User login status fetched successfully.
 *       400:
 *         description: Failed to fetch user login status ,unauthorized.
 */
route.get('/', asyncHandler(fetchAuthenticationInfluencer));
// Route to fetch an OAuth access token
route.get('/oauth/token', isAuthenticated, asyncHandler(fetchInfluencerAuthenticationAccessToken));

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Log in
 *     tags: [Influencer]
 *     responses:
 *       302:
 *         description: Redirect to the login page after auth0 authentication
 *       403:
 *         description: Please login', ['Unauthorized']
 */
// Route to log in
route.get('/login', isAuthenticated, (req, res) => {
  res.oidc.login({returnTo: '/profile'});
});

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Display the user's profile information
 *     tags: [Influencer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile fetched successfully.
 *       401:
 *         description: Unauthorized.
 */
// Route to display the user's profile information
route.get('/profile', isAuthenticated, asyncHandler(fetchProfileOfInfluencer));

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Log out the user
 *     tags: [Influencer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully.
 *       400:
 *         description: Failed to log out user.
 */
// Route to log out the user, requires the user to be authenticated
route.get('/logout', requiresAuth, asyncHandler(logoutInfluencer));
export default route;
