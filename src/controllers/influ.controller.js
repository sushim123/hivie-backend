import {STATUS_CODES} from '../constants.js';
import {apiResponse} from '../utils/apiResponse.util.js';
import { apiError } from '../utils/apiError.util.js';
export const fetchAuthenticationinflu = async (req, res) => {
  try {
    res.send(
      new apiResponse(STATUS_CODES.OK, req.oidc.isAuthenticated(), 'influencer login status fetched successfully', true)
    );
  } catch (error) {
    throw new apiResponse(STATUS_CODES.BAD_REQUEST, 'Failed to fetch user login status', error);
  }
};

export const logininflu = async (req, res) => {
  res.oidc.login({
    returnTo: '/profile'
  });
};

export const fetchProfileOfinflu = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      throw new apiError(STATUS_CODES.NOT_FOUND, 'User not found', []);
    }

    res.status(STATUS_CODES.OK).send(message ,'Dashboard fetched successfully', {
      user,
      message: 'Dashboard fetched successfully'
    });
  } catch (error) {
    next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to fetch profile', error));
  }
};

export const logoutinflu = (req, res) => {
  res.redirect('/logout');
};
