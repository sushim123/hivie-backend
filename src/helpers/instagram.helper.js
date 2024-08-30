import axios from 'axios';
import {apiError} from '../utils/apiError.util.js';
import { API_INSTAGRAM_GRAPH, OPTIONS_INSTAGRAM } from '../constants.js';

const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

// Function to get user info
export const getUserInfo = async (accessToken) => {
  try {
    const response = await axios.get('https://graph.instagram.com/me', {
      params: {
        fields: 'id,username',
        access_token: accessToken
      }
    });
    return response.data;
  } catch (error) {
    throw new apiError(error.status, 'Error fetching user data', [error.message]);
  }
};

// Function to get business discovery data
export const getBusinessDiscovery = async (username) => {
  try {
    const encodedUsername = encodeURIComponent(username);
    const response = await axios.get(API_INSTAGRAM_GRAPH, {
      params: {
        fields: `business_discovery.username(${encodedUsername})${OPTIONS_INSTAGRAM}}`,
        access_token: accessToken
      }
    });
    return response.data.business_discovery;
  } catch (error) {
    throw new apiError(error.status, 'Error fetching business discovery info', error.message, false);
  }
};
// Function to calculate metrics
export const calculateMetrics = (businessInfo) => {
  let totalLikes = 0;
  let totalComments = 0;
  let numberOfPosts = 0;

  if (businessInfo.media && businessInfo.media.data) {
    totalLikes = businessInfo.media.data.reduce((acc, media) => acc + (media.like_count || 0), 0);
    totalComments = businessInfo.media.data.reduce((acc, media) => acc + (media.comments_count || 0), 0);
    numberOfPosts = businessInfo.media.data.length;
  } else {
    throw new apiError(502, 'Unable To Fetch Media Data', error.message, false);
  }

  const averageLikes = numberOfPosts > 0 ? totalLikes / numberOfPosts : 0;
  const averageComments = numberOfPosts > 0 ? totalComments / numberOfPosts : 0;
  const engagementRate =
    numberOfPosts > 0 ? ((totalLikes + totalComments) / (numberOfPosts * businessInfo.followers_count)) * 100 : 0;
  return {averageLikes, averageComments, engagementRate};
};
