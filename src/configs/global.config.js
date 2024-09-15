

export const OAUTH_CONFIG = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.OAUTH_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.OAUTH_CLIENT_ID,
  issuerBaseURL: process.env.OAUTH_ISSUER_BASE_URL
};

export const INSTA_TOKEN_PARAMS = {
  client_id: process.env.INSTA_CLIENT_ID_1, // Use INSTA_CLIENT_ID_1 only
  client_secret: process.env.INSTA_CLIENT_SECRET_1, // Use INSTA_CLIENT_SECRET_1 only
  grant_type: 'authorization_code',
  redirect_uri: process.env.INSTA_REDIRECT_URL
};

export const INSTA_CODE_PARAMS = {
  client_id: process.env.INSTA_CLIENT_ID_1, // Use INSTA_CLIENT_ID_1 only
  redirect_uri: process.env.INSTA_REDIRECT_URL,
  response_type: 'code',
  scope: 'user_profile,user_media'
};
