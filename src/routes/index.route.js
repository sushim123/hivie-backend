import {Router} from 'express';
import pkg from 'express-openid-connect';
import {STATUS_CODES} from '../constants.js';
import {getAuthToken} from '../helpers/getAuthToken.helper.js';
import {isAuthenticated} from '../middlewares/auth.middleware.js';
import {apiResponse} from '../utils/apiResponse.util.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';
const {requiresAuth} = pkg;

const route = Router();

// Route to check if the user is authenticated
route.get(
  '/',
  asyncHandler(async (req, res, next) => {
    try {
      res.send(
        new apiResponse(STATUS_CODES.OK, req.oidc.isAuthenticated(), 'User login status fetched successfully', true)
      );
    } catch (error) {
      throw new apiResponse(STATUS_CODES.BAD_REQUEST, 'Failed to fetch user login status', error);
    }
  })
);

// Route to fetch an OAuth access token
route.get(
  '/oauth/token',
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    const accessToken = await getAuthToken();
    res.send(new apiResponse(STATUS_CODES.OK, accessToken, 'Token fetched successfully', true));
  })
);
route.get('/login', (req, res) => {
  res.oidc.login({
    returnTo: '/' // Optionally specify where to redirect after login
  });
});

// Route to display the user's profile information
route.get('/profile', isAuthenticated, async (req, res, next) => {
  res.send(new apiResponse(STATUS_CODES.OK, req.oidc.user, 'Dashboard fetched successfully', true));
});

// Route to log out the user, requires the user to be authenticated
route.get('/logout', requiresAuth(), (req, res, next) => {
  req.oidc.logout(); // Clear the session and logout the user
  res.send(new apiResponse(STATUS_CODES.OK, null, 'User logged out successfully', true));
});

// Route to display the dashboard

export default route;
