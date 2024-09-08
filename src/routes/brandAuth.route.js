import {Router} from 'express';
import pkg from 'express-openid-connect';
import {STATUS_CODES} from '../constants.js';
import {getAuthToken} from '../helpers/getAuthToken.helper.js';
import {isAuthenticatedBrand} from '../middlewares/auth.middleware.js';
import {apiResponse} from '../utils/apiResponse.util.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';
const {requiresAuth} = pkg;

const route = Router();

// Route to check if the user is authenticated
route.get(
  '/',
  requiresAuth(),
  isAuthenticatedBrand,
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

route.get('/login', (req, res) => {
  res.oidc.login({
    returnTo: '/api/v1/brand' // Optionally specify where to redirect after login
  });
});

// Route to display the user's profile information
route.get('/profile', isAuthenticatedBrand, async (req, res, next) => {
  res.send(new apiResponse(STATUS_CODES.OK, req.oidc.user, 'Dashboard fetched successfully', true));
});

route.get('/logout', requiresAuth(), (req, res, next) => {
  // res.send('hi');
  res.redirect('/logout');
});
export default route;
