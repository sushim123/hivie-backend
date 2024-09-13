import {INSTA_REDIRECT_URL} from '../constants.js';
export const OAUTH_CONFIG = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.OAUTH_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.OAUTH_CLIENT_ID,
  issuerBaseURL: process.env.OAUTH_ISSUER_BASE_URL
};
export const INSTA_TOKEN_PARAMS = {
  client_id: process.env.NODE_DEV_ENV ? process.env.INSTA_CLIENT_ID_1 : process.env.INSTA_CLIENT_ID,
  client_secret: process.env.NODE_DEV_ENV ? process.env.INSTA_CLIENT_SECRET_1 : process.env.INSTA_CLIENT_SECRET,
  grant_type: 'authorization_code',
  redirect_uri: 'https://hivie-backend-ewk0.onrender.com/api/v1/insta/auth/callback'
};
export const INSTA_CODE_PARAMS = {
  client_id: process.env.NODE_DEV_ENV ? process.env.INSTA_CLIENT_ID_1 : process.env.INSTA_CLIENT_ID,
  redirect_uri: 'https://hivie-backend-ewk0.onrender.com/api/v1/insta/auth/callback',
  response_type: 'code',
  scope: 'user_profile,user_media'
};
