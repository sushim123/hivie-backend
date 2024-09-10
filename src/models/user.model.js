import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';


const platformLinksSchema = new mongoose.Schema({
  youtube: { type: String, default: '' },
  tiktok: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  discord: { type: String, default: '' },
}, { timestamps: true });

const pricingSchema = new mongoose.Schema({
  postPrice: { type: Number, required: true, min: 0 },
  reelPrice: { type: Number, required: true, min: 0 },
  brandRange: { type: Number, required: true, enum: Array.from({ length: 10 }, (_, i) => i + 1) },
}, { timestamps: true });
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
    isTemporary: {type: Boolean, default: true},
    expiresAt: { type: Date, default: null },
    platformLinks: [platformLinksSchema],
    pricing:  [pricingSchema] ,
  },
  
  {timestamps: true}
);
userSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
userSchema.pre('save', function (next) {
  if (this.isTemporary) {
    this.expiresAt = new Date(Date.now() + 1 * 60 * 1000); 
  }
  else (this.expiresAt = null);
  next();
});

userSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.isTemporary === false) {
    update.expiresAt = null; 
  } else if (update.isTemporary === true) {
    update.expiresAt = new Date(Date.now() + 1 * 60 * 1000); 
  }
  next();
});
userSchema.plugin(mongooseAggregatePaginate);
export const User = mongoose.model('User', userSchema);