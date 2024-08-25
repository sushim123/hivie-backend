import axios from 'axios';
import {config} from '../configs/oAuth.config.js';

// Export an asynchronous function to get an Auth0 access token
export const getAuthToken = async () => {
  try {
    // Make a POST request to the Auth0 token endpoint to get an access token
    const response = await axios.post(
      `${config.issuerBaseURL}/oauth/token`, // The token endpoint of the Auth0 issuer
      {
        client_id: process.env.USERDATA_API_CLIENT_ID,
        client_secret: process.env.USERDATA_API_CLIENT_SECRETE,
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
    console.error('Error fetching token:', error);
  }
};
