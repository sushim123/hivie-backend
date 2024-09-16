import {STATUS_CODES} from '../constants.js';
import {apiResponse} from '../utils/apiResponse.util.js';

export const fetchAuthenticationBrand = async (req, res) => {
  try {
    res.send(
      new apiResponse(STATUS_CODES.OK, req.oidc.isAuthenticated(), 'Brand login status fetched successfully', true)
    );
  } catch (error) {
    throw new apiResponse(STATUS_CODES.BAD_REQUEST, 'Failed to fetch user login status', error);
  }
};

export const loginBrand = async (req, res) => {
  res.oidc.login({
    returnTo: '/' // Optionally specify where to redirect after login
  });
};

export const fetchProfileOfBrand = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      throw new apiError(STATUS_CODES.NOT_FOUND, 'User not found', []);
    }

    res.status(STATUS_CODES.OK).render('brandProfile', {
      user,
      message: 'Dashboard fetched successfully'
    });
  } catch (error) {
    next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to fetch profile', error));
  }
};

export const logoutBrand = (req, res) => {
  res.redirect('/logout');
};
