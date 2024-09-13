import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const digitalScore = new mongoose.Schema(
  {
    engagementRate: {type: Number, required: true},
    followerToFollowingRatio: {type: Number, required: true},
    contentConsistency: {type: Number, required: true},
    contentQuality: {type: Number, required: true},
    rawScore: {type: Number, required: true},
    creatorScore: {type: Number, required: true, default: 0}
  });

const userSchema = new mongoose.Schema(
  {
    nickname: {type: String, required: [true, 'Nickname is required']},
    name: String,
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      unique: true,
      trim: true,
      index: true
    },
    refreshToken: {type: String, default: ''},
    role: {
      type: String,
      enum: ['admin', 'influencer', 'brand'],
      required: true,
      default: 'influencer'
    },
    picture: {type: String, default: ''},
    sid: {type: String, default: ''},
    given_name: {type: String, default: ''},
    family_name: {type: String, default: ''},
    sub: {type: String, default: ''},
    email_verified: {type: Boolean, default: false},
    instaData:{type: mongoose.Schema.Types.ObjectId, ref: 'InstagramData'},
    digitalScore: {type: digitalScore},
  },
  {timestamps: true}
);

userSchema.plugin(mongooseAggregatePaginate);
export const User = mongoose.model('User', userSchema);
