import axios from 'axios';
import {OAUTH_CONFIG} from '../configs/global.config.js';
import {apiError} from '../utils/apiError.util.js';

// Export an asynchronous function to get an Auth0 access token
export const getAuthToken = async () => {
  try {
    // Make a POST request to the Auth0 token endpoint to get an access token
    const response = await axios.post(
      `${OAUTH_CONFIG.issuerBaseURL}/oauth/token`, // The token endpoint of the Auth0 issuer
      {
        client_id: process.env.USERDATA_API_CLIENT_ID,
        client_secret: process.env.USERDATA_API_CLIENT_SECRET,
        audience: 'hivie.co', // The audience for which the token is requested, typically the API identifier
        grant_type: 'client_credentials' // The grant type used for machine-to-machine authentication
      },
      {
        headers: {'Content-Type': 'application/json'} // Set the content type of the request to JSON
      }
    );
    // Return the access token from the response data
    return response.data.access_token;
  } catch (error) {
    throw new apiError(error.status, 'Error fetching access token', [error.message]);
  }
};
