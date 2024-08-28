import axios from 'axios';
import dotenv from 'dotenv'; // Loads environment variables from a .env file
import {calculateMetrics, getBusinessDiscovery, getUserInfo} from '../helpers/instagram.helper.js';
import {apiError} from '../utils/apiError.util.js';
import {apiResponse} from '../utils/apiResponse.util.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';
dotenv.config({path: './.env'});

const redirectUri = 'https://localhost:4000/api/v1/insta/auth/callback';

export const fetchDataByInstaAuth = async (req, res) => {
  const authCode = req.query.code;
  if (authCode) {
    try {
      const params = new URLSearchParams({
        client_id: process.env.INSTA_CLIENT_ID,
        client_secret: process.env.INSTA_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code: authCode
      });
      const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', params);
      const accessToken = tokenResponse.data.access_token;

      const userInfo = await getUserInfo(accessToken);
      const username = userInfo.username;
      const businessInfo = await getBusinessDiscovery(username);

      const responseData = {
        accessToken,
        userInfo,
        businessInfo
      };
      res.json(responseData);
    } catch (error) {
      console.error(
        'Error during authorization or fetching data:',
        error.response ? error.response.data : error.message
      );
      res.status(500).json({
        error: 'Error during authorization or fetching data.',
        details: error.response ? error.response.data : error.message
      });
    }
  } else {
    res.status(400).json({error: 'Authorization failed or was denied.'});
  }
};

export const getAuthInstaCode = asyncHandler(async (req, res) => {
  try {
    const params = new URLSearchParams({
      client_id: process.env.INSTA_CLIENT_ID,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'user_profile,user_media'
    });

    const authUrl = `https://api.instagram.com/oauth/authorize?${params.toString()}`;
    res.redirect(authUrl);
  } catch (error) {
    res.status(400).json(new apiError(400, 'code not found', error.message));
  }
});

export const fetchDataByUsername = async (req, res) => {
  const {username} = req.params;
  if (username) {
    try {
      const businessInfo = await getBusinessDiscovery(username);
      const metrics = calculateMetrics(businessInfo);

      const responseData = {
        businessInfo,
        metrics
      };

      res.status(200).json(new apiResponse(200, responseData, `User's data fetched successfully.`, true));
    } catch (error) {
      res
        .status(400)
        .json(new apiError(400, 'Error fetching data.', error.response ? error.response.data : error.message));
    }
  } else {
    res.status(502).json(new apiError(502, 'Please provide username ', 'username not found'));
  }
};
