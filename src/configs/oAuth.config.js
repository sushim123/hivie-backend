export const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.OAUTH_SECRET,
  baseURL: process.env.BASE_URL,
  clientID: process.env.OAUTH_CLIENT_ID,
  issuerBaseURL: process.env.OAUTH_ISSUER_BASE_URL
};
