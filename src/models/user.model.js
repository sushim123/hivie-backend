import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

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
    email_verified: {type: Boolean, default: false}
  },
  {timestamps: true}
);

userSchema.plugin(mongooseAggregatePaginate);
export const User = mongoose.model('User', userSchema);
