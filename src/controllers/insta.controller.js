import axios from 'axios';
import dotenv from 'dotenv'; // Loads environment variables from a .env file
import {INSTA_CODE_PARAMS, INSTA_TOKEN_PARAMS} from '../configs/global.config.js';
import {INSTA_URL, STATUS_CODES} from '../constants.js';
import {
  calculateMetrics,
  createInstagramDataObject,
  getBusinessDiscovery,
  getUserInfo
} from '../helpers/instagram.helper.js';
import {InstagramData} from '../models/instagramData.model.js';
import {User} from '../models/user.model.js';
import {apiError} from '../utils/apiError.util.js';
import {apiResponse} from '../utils/apiResponse.util.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';
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
      res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(STATUS_CODES.OK, {accessToken, userInfo, businessInfo}, 'All date fetched successfully.')
        );
    } catch (error) {
      throw new apiError(STATUS_CODES.METHOD_NOT_ALLOWED, 'Error fetching data.', error);
    }
  } else {
    throw new apiError(STATUS_CODES.UNAUTHORIZED, 'Authentication failed');
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
export const fetchDataByUsername = async (req, res, next) => {
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
      // Update existing data with the new fetched data
      existingData.data = instagramDataObject.data; // Replace with new data
      await existingData.save();
      try {
        console.log(req.user._id);
        await User.findByIdAndUpdate(req.user._id, {instaData: existingData._id}, {new: true});
      } catch (error) {
        throw new apiError(STATUS_CODES.BAD_REQUEST, 'Error finding and updating the instaId into user DB', error);
      }
      return res
        .status(STATUS_CODES.OK)
        .json(
          new apiResponse(STATUS_CODES.OK, existingData, 'User data updated with the instaDataBase information.', true)
        );
    } else {
      // If no existing data, create a new entry
      const instagramData = new InstagramData(instagramDataObject);
      const response = instagramData.save();
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
