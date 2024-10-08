import {STATUS_CODES} from '../constants.js';
import {apiResponse} from '../utils/apiResponse.util.js';
import { apiError } from '../utils/apiError.util.js';
import crypto from 'crypto';

const scope = 'openid profile email';
const responseType = 'id_token';
const responseMode = 'form_post';
const redirectUri = 'http://localhost:4000/callback';

// Function to generate a nonce and state
const generateNonceAndState = () => {
  return {
    nonce: crypto.randomBytes(16).toString('base64'),
    state: JSON.stringify({ returnTo: '/profile' })
  };
};

export const fetchAuthenticationinflu = async (req, res) => {
  try {
    res.send(
      new apiResponse(STATUS_CODES.OK, req.oidc.isAuthenticated(), 'influencer login status fetched successfully', true)
    );
  } catch (error) {
    throw new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to fetch user login status', error);
  }
};

export const logininflu = async (req, res) => {
  try {
    // Generate nonce and state
    const { nonce, state } = generateNonceAndState();

    // Generate the Auth0 login URL
    const authUrl = `${process.env.OAUTH_ISSUER_BASE_URL}/authorize?` + new URLSearchParams({
      client_id: process.env.OAUTH_CLIENT_ID,
      scope: scope,
      response_type: responseType,
      redirect_uri: redirectUri,
      response_mode: responseMode,
      nonce: nonce,
      state: state,
    }).toString();

    console.log('Auth0 login URL:', authUrl);

    // Redirect the user to the Auth0 login page
    res.redirect(authUrl);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: 'Login failed. Please try again later.' });
  }
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
