import axios from 'axios';
import dotenv from 'dotenv'; // Loads environment variables from a .env file
import {STATUS_CODES} from '../constants.js';
import {INSTA_CODE_PARAMS, INSTA_TOKEN_PARAMS} from '../configs/global.config.js';
import {INSTA_URL} from '../constants.js';
import {calculateMetrics, getBusinessDiscovery, getUserInfo} from '../helpers/instagram.helper.js';
import {apiError} from '../utils/apiError.util.js';
import {apiResponse} from '../utils/apiResponse.util.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';
dotenv.config({path: './.env'});

export const fetchDataByInstaAuth = async (req, res) => {
  const authCode = req.query.code;
  if (authCode) {
    try {
      const tokenResponse = await axios.post(`${INSTA_URL}/access_token`, new URLSearchParams({...INSTA_TOKEN_PARAMS,code:authCode}));
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
      res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, responseData, `User's data fetched successfully.`));
    } catch (error) {
      new apiError(STATUS_CODES.METHOD_NOT_ALLOWED, 'Error fetching data.', error);
    }
  } else {
    throw new apiError(STATUS_CODES.BAD_REQUEST, 'Please provide username', 'username not found');
  }
};
