import axios from 'axios';
import dotenv from 'dotenv'; // Loads environment variables from a .env file
import {INSTA_CODE_PARAMS, INSTA_TOKEN_PARAMS} from '../configs/global.config.js';
import {INSTA_URL, STATUS_CODES} from '../constants.js';
import {calculateMetrics, getBusinessDiscovery, getUserInfo} from '../helpers/instagram.helper.js';
import {createInstagramDataObject} from '../helpers/instagram.helper.js';
import InstagramData from '../models/instagramData.model.js';
import {apiError} from '../utils/apiError.util.js';
import {apiResponse} from '../utils/apiResponse.util.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';
import { User } from '../models/user.model.js';
dotenv.config({path: './.env'});
export const fetchDataByInstaAuth = async (req, res) => {
  const authCode = req.query.code;
  if (authCode) {
    try {
      const tokenResponse = await axios.post(
        `${INSTA_URL}/access_token`,
        new URLSearchParams({...INSTA_TOKEN_PARAMS, code: authCode})
      );
      const accessToken = tokenResponse.data.access_token;
      const userInfo = await getUserInfo(tokenResponse.data.access_token);
      const businessInfo = await getBusinessDiscovery(userInfo.username);

      // Flatten the media data
      const mediaArray = businessInfo.media?.data || [];

      const { email } = req.oidc.user;
      if (!email) {
        throw new apiError(STATUS_CODES.UNAUTHORIZED, 'Email not found in user info');
      }
      await User.findOneAndUpdate({ email }, { isTemporary: false , expiresAt: null });
      res.render('instagramAuthResult', {
        accessToken,
        userInfo,
        businessInfo: { ...businessInfo, media: mediaArray },
        error: null
      });
    } catch (error) {
      res.render('instagramAuthResult', {
        accessToken: null,
        userInfo: null,
        businessInfo: { media: [] },
        error: 'Error fetching data. Please try again.'
      });
    }
  } else {
    res.render('instagramAuthResult', {
      accessToken: null,
      userInfo: null,
      businessInfo: { media: [] },
      error: 'Authentication failed. No code provided.'
    });
  }
};


export const getAuthInstaCode = asyncHandler(async (req, res) => {
  try {
    const params = new URLSearchParams(INSTA_CODE_PARAMS);
    res.redirect(`${INSTA_URL}/authorize?${params.toString()}`);
  } catch (error) {
    throw new apiError(STATUS_CODES.BAD_REQUEST, 'Code not found', error);
  }
});
export const fetchDataByUsername = async (req, res) => {
  const {username} = req.params;

  if (!username) {
    return res
      .status(STATUS_CODES.BAD_GATEWAY)
      .json(new apiError(STATUS_CODES.BAD_GATEWAY, 'Please provide a username', 'username not found'));
  }

  try {
    // Always fetch the latest data from Instagram
    const businessInfo = await getBusinessDiscovery(username);
    const metrics = calculateMetrics(businessInfo);
    const mediaData = businessInfo.media?.data || [];
    const instagramDataObject = createInstagramDataObject(businessInfo, mediaData, metrics);

    // Check if the data already exists in the database
    const existingData = await InstagramData.findOne({'data.username': username});

    if (existingData) {
      existingData.data = instagramDataObject.data; // Replace with new data
      await existingData.save();
      return res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, existingData, 'User data updated with the latest information.', true));
    } else {
      // If no existing data, create a new entry
      const instagramData = new InstagramData(instagramDataObject);
      await instagramData.save();

      const responseData = {businessInfo, metrics};
      return res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, responseData, `User's data fetched and stored successfully.`, true));
    }
  } catch (error) {
    // Handle any errors during fetching or saving data
    res
      .status(STATUS_CODES.BAD_REQUEST)
      .json(
        new apiError(
          STATUS_CODES.BAD_REQUEST,
          'Error fetching or saving data.',
          error.response ? error.response.data : error.message
        )
      );
  }
};
