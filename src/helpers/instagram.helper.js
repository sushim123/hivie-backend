import axios from 'axios';
import {API_INSTA_GRAPH, INSTA_GRAPH_URL, OPTIONS_INSTA, STATUS_CODES} from '../constants.js';
import InstagramData from '../models/instagramData.model.js';
import {apiError} from '../utils/apiError.util.js';
const accessToken = process.env.INSTA_ACCESS_TOKEN;

// Function to get user info
export const getUserInfo = async (accessToken) => {
  try {
    const response = await axios.get(`${INSTA_GRAPH_URL}`, {
      params: {
        fields: 'id,username',
        access_token: accessToken
      }
    });
    return response.data;
  } catch (error) {
    throw new apiError(error.response?.status || STATUS_CODES.INTERNAL_SERVER_ERROR, 'Error fetching user data', [
      error.message
    ]);
  }
};

// Function to get business discovery data
export const getBusinessDiscovery = async (username) => {
  try {
    const encodedUsername = encodeURIComponent(username);
    const response = await axios.get(API_INSTA_GRAPH, {
      params: {
        fields: `business_discovery.username(${encodedUsername})${OPTIONS_INSTA}`,
        access_token: accessToken
      }
    });

    // Corrected logging statement
    return response.data.business_discovery;
  } catch (error) {
    throw new apiError(
      error.response?.status || STATUS_CODES.INTERNAL_SERVER_ERROR,
      'Error fetching business discovery info',
      error.message,
      false
    );
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
    throw new apiError(STATUS_CODES.BAD_GATEWAY, 'Unable to fetch media data', 'Media data not found');
  }

  const averageLikes = numberOfPosts > 0 ? totalLikes / numberOfPosts : 0;
  const averageComments = numberOfPosts > 0 ? totalComments / numberOfPosts : 0;
  const engagementRate =
    numberOfPosts > 0 ? ((totalLikes + totalComments) / (numberOfPosts * businessInfo.followers_count)) * 100 : 0;

  return {averageLikes, averageComments, engagementRate};
};
export const fetchMediaDataFromPermalink = async (permalink) => {
  try {
    const response = await InstagramData.findOne({'data.media.permalink': permalink});
    if (response) {
      const media = response.data.media.find((mediaItem) => mediaItem.permalink === permalink);
      return media || null;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching media data for permalink ${permalink}:`, error);
    return null;
  }
};
export const transformMediaData = (mediaData) => {
  return mediaData.map((item) => ({
    id: item.id || '',
    caption: item.caption || '',
    media_type: item.media_type || '',
    media_url: item.media_url || '',
    thumbnail_url: item.thumbnail_url || '',
    permalink: item.permalink || '',
    timestamp: item.timestamp ? new Date(item.timestamp) : new Date(),
    like_count: item.like_count || 0,
    comments_count: item.comments_count || 0
  }));
};

// Function to create Instagram data object
export const createInstagramDataObject = (businessInfo, mediaData, metrics) => {
  return {
    data: {
      id: businessInfo.id,
      username: businessInfo.username,
      name: businessInfo.name,
      profile_picture_url: businessInfo.profile_picture_url,
      followers_count: businessInfo.followers_count,
      follows_count: businessInfo.follows_count,
      media_count: businessInfo.media_count,
      media: transformMediaData(mediaData),
      metrics: metrics
    }
  };
};
