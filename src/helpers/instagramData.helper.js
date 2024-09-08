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
