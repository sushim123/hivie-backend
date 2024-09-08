import mongoose from 'mongoose';

// Media Schema to store individual media information
const MediaSchema = new mongoose.Schema(
  {
    id: {type: String, required: true},
    caption: {type: String},
    media_type: {type: String},
    media_url: {type: String},
    permalink: {type: String},
    timestamp: {type: Date},
    like_count: {type: Number},
    comments_count: {type: Number}
  },
  {_id: false} // Prevents auto-creation of an _id for subdocuments
);

// Metrics Schema to store metrics information
const MetricsSchema = new mongoose.Schema(
  {
    averageLikes: {type: Number, required: true},
    averageComments: {type: Number, required: true},
    engagementRate: {type: Number, required: true}
  },
  {_id: false} // Prevents auto-creation of an _id for subdocuments
);

// Business Information Schema to store Instagram business information
const BusinessInfoSchema = new mongoose.Schema(
  {
    id: {type: String, required: true},
    username: {type: String, required: true, index: true},
    name: {type: String, required: true},
    profile_picture_url: {type: String, required: true},
    followers_count: {type: Number, required: true},
    follows_count: {type: Number, required: true},
    media_count: {type: Number, required: true},
    media: {type: [MediaSchema], required: true},
    metrics: {type: MetricsSchema, required: true} // Changed from array to single object
  },
  {_id: false} // Prevents auto-creation of an _id for subdocuments
);

// Main Instagram Data Schema to store all information together
const InstagramDataSchema = new mongoose.Schema(
  {
    data: {type: BusinessInfoSchema, required: true}
  },
  {timestamps: true}
);

const InstagramData = mongoose.model('InstagramData', InstagramDataSchema);

export default InstagramData;
