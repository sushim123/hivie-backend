import axios from 'axios';
import {ApiError} from '../utils/ApiError.util.js';

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
    throw new ApiError(error.status, 'Error fetching user data', [error.message]);
  }
};

// Function to get business discovery data
export const getBusinessDiscovery = async (username) => {
  try {
    const encodedUsername = encodeURIComponent(username);
    const response = await axios.get(`https://graph.facebook.com/v20.0/17841468546353221`, {
      params: {
        fields: `business_discovery.username(${encodedUsername}){id,username,name,profile_picture_url,followers_count,follows_count,media_count,media{id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count}}`,
        access_token: accessToken
      }
    });
    return response.data.business_discovery;
  } catch (error) {
    throw new ApiError(error.status, 'Error fetching business discovery info', error.message, false);
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
    throw new ApiError(502, 'Unable To Fetch Media Data', error.message, false);
  }

  const averageLikes = numberOfPosts > 0 ? totalLikes / numberOfPosts : 0;
  const averageComments = numberOfPosts > 0 ? totalComments / numberOfPosts : 0;
  const engagementRate =
    numberOfPosts > 0 ? ((totalLikes + totalComments) / (numberOfPosts * businessInfo.followers_count)) * 100 : 0;
  return {averageLikes, averageComments, engagementRate};
};
