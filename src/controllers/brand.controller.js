import {STATUS_CODES} from '../constants.js';
import {apiResponse} from '../utils/apiResponse.util.js';


export const fetchAuthenticationBrand = async (req, res) => {
    try {
      res.send(
        new apiResponse(STATUS_CODES.OK, req.oidc.isAuthenticated(), 'User login status fetched successfully', true)
      );
    } catch (error) {
      throw new apiResponse(STATUS_CODES.BAD_REQUEST, 'Failed to fetch user login status', error);
    }
  }

export const loginBrand = async (req, res) => {
    res.oidc.login({
      returnTo: '/api/v1/brand' // Optionally specify where to redirect after login
    });
  }
export const fetchProfileOfbrand = async (req, res) => {
    res.send(new apiResponse(STATUS_CODES.OK, req.oidc.user, 'Dashboard fetched successfully', true));
  }

 export const logoutBrand =  (req, res ) => {
    res.redirect('/logout');
  }