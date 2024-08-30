import mongoose from 'mongoose';

const MediaSchema = new mongoose.Schema(
  {
    id: {type: String, required: true},
    caption: {type: String},
    media_type: {type: String, required: true},
    media_url: {type: String, required: true},
    permalink: {type: String, required: true},
    timestamp: {type: Date, required: true},
    like_count: {type: Number, required: true},
    comments_count: {type: Number, required: true}
  },
  {_id: false}
);

const BusinessInfoSchema = new mongoose.Schema(
  {
    id: {type: String, required: true},
    username: {type: String, required: true, index: true},
    name: {type: String, required: true},
    profile_picture_url: {type: String, required: true},
    followers_count: {type: Number, required: true},
    follows_count: {type: Number, required: true},
    media_count: {type: Number, required: true},
    media: {type: [MediaSchema], required: true}
  },
  {_id: false}
);

const InstagramDataSchema = new mongoose.Schema(
  {
    data: {type: BusinessInfoSchema, required: true}
  },
  {timestamps: true}
);

const InstagramData = mongoose.model('InstagramData', InstagramDataSchema);

export default InstagramData;
