import { STATUS_CODES } from '../constants.js';
import { getAuthToken } from '../helpers/getAuthToken.helper.js';
import { apiResponse } from '../utils/apiResponse.util.js';

export const fetchAuthenticationInfluencer = async (req, res, next) => {
  try {
    res.send(
      new apiResponse(
        STATUS_CODES.OK,
        req.oidc.isAuthenticated(),
        'User login status fetched successfully',
        true
      )
    );
  } catch (error) {
    next(new apiResponse(STATUS_CODES.BAD_REQUEST, 'Failed to fetch user login status', error));
  }
};

// OAuth access token
export const fetchInfluenderAuthenticationAccessToken = async (req, res, next) => {
  try {
    const accessToken = await getAuthToken();
    res.send(new apiResponse(STATUS_CODES.OK, accessToken, 'Token fetched successfully', true));
  } catch (error) {
    next(new apiResponse(STATUS_CODES.BAD_REQUEST, 'Failed to fetch access token', error));
  }
};

export const fetchProfileOfInfluencer = async (req, res, next) => {
  try {
    res.send(new apiResponse(STATUS_CODES.OK, req.oidc.user, 'Dashboard fetched successfully', true));
  } catch (error) {
    next(new apiResponse(STATUS_CODES.BAD_REQUEST, 'Failed to fetch profile', error));
  }
};

export const logoutInfluender = async (req, res, next) => {
  try {
    req.oidc.logout(); // Clear the session and logout the user
    return res.send(new apiResponse(STATUS_CODES.OK, null, 'User logged out successfully', true));
  } catch (error) {
    next(new apiResponse(STATUS_CODES.BAD_REQUEST, 'Failed to log out user', error));
  }
};
