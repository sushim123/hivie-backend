// Export the configuration object for Auth0 authentication
export const config = {
  // Determine if authentication is required for all routes
  authRequired: false, // Set to false to allow access to routes without authentication by default
  // Enable Auth0 logout functionality
  auth0Logout: true, // When true, logging out of the app will also log the user out of Auth0
  // Secret used to encrypt the session cookies
  secret: process.env.OAUTH_SECRET, // Securely store this secret in environment variables
  // Base URL of the application, constructed from environment variables
  baseURL: `http://localhost:4000`, // The base URL of your app, including the port
  // Auth0 Client ID, specific to your application
  clientID: 'kAmS8JHCNA5sQyAisic7ekqJ1kZbfBdo',
  // URL of the Auth0 tenant where your application is registered
  issuerBaseURL: 'https://dev-q30m35me57rff58k.us.auth0.com', // The Auth0 domain
};
