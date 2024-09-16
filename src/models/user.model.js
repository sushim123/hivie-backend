import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import { preSaveMiddleware, preFindOneAndUpdateMiddleware } from '../middlewares/userSchema.middleware.js';

// Digital Score Schema
const digitalScoreSchema = new mongoose.Schema({
  engagementRate: { type: Number, required: true },
  followerToFollowingRatio: { type: Number, required: true },
  contentConsistency: { type: Number, required: true },
  contentQuality: { type: Number, required: true },
  rawScore: { type: Number, required: true },
  creatorScore: { type: Number, required: true, default: 0 }
}, { _id: false });

// Platform Links Schema
const platformLinksSchema = new mongoose.Schema({
  youtube: String,
  tiktok: String,
  linkedin: String,
  discord: String,
  instagram: {
    type: String,
    required: function() {
      return this.ownerDocument().role === 'brand';
    },
  },
}, { _id: false });

// Pricing Schema
const pricingSchema = new mongoose.Schema({
  postPrice: { type: Number, required: true, min: 0 },
  reelPrice: { type: Number, required: true, min: 0 },
  brandRange: { type: Number, required: true, enum: Array.from({ length: 10 }, (_, i) => i + 1) },
}, { _id: false });

// Industry Schema
const industrySchema = new mongoose.Schema({
  industryType: {
    type: String,
    required: true,
    enum: [
      'Consumer Goods', 'Technology', 'Automotive', 'Healthcare', 'Finance', 'Retail',
      'Food & Beverage', 'Media & Entertainment', 'Energy & Utilities', 'Transportation & Logistics',
      'Hospitality & Tourism', 'Real Estate', 'Telecommunications', 'Education & E-Learning', 'Aerospace & Defense'
    ],
  },
  industrySubtype: {
    type: String,
    required: true,
    enum: [
      'FMCG', 'Consumer Electronics', 'Fashion & Apparel', 'Beauty & Personal Care',
      'Software & Services', 'Hardware', 'Telecommunication', 'Car Manufacturers', 'Motorcycles',
      'Auto Parts & Accessories', 'Pharmaceuticals', 'Medical Devices', 'Health Insurance', 'Banks',
      'Financial Services', 'Insurance', 'Brick-and-Mortar Retail', 'E-Commerce', 'Restaurants',
      'Alcoholic Beverages', 'Non-Alcoholic Beverages', 'Streaming Services', 'Traditional Media',
      'Gaming', 'Oil & Gas', 'Renewable Energy', 'Utilities', 'Airlines', 'Shipping & Logistics',
      'Hotels & Resorts', 'Travel Agencies', 'Residential & Commercial Real Estate', 'Telecom Providers',
      'Online Learning Platforms', 'Traditional Educational Institutions', 'Aerospace', 'Defense'
    ],
  },
}, { _id: false });

// Brand Info Schema
const brandInfoSchema = new mongoose.Schema({
  socialMediaPlatformLinks: { type: platformLinksSchema, default: {} },
  reasonForOnboarding: {
    type: String,
    enum: ['Search and discovery', 'Quick campaigns'],
    required: true,
  },
}, { _id: false });

// User Schema
const userSchema = new mongoose.Schema({
  nickname: { type: String, required: [true, 'Nickname is required'] },
  name: String,
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    unique: true,
    trim: true,
    index: true,
  },
  refreshToken: { type: String, default: '' },
  role: { type: String, enum: ['admin', 'influencer', 'brand'], required: true, default: 'influencer' },
  picture: { type: String, default: '' },
  sid: { type: String, default: '' },
  given_name: { type: String, default: '' },
  family_name: { type: String, default: '' },
  sub: { type: String, default: '' },
  email_verified: { type: Boolean, default: false },
  instaData: { type: mongoose.Schema.Types.ObjectId, ref: 'InstagramData' },
  digitalScore: { type: digitalScoreSchema },
  isTemporary: { type: Boolean, default() { return this.role === 'influencer'; } },
  expiresAt: { type: Date, default() { return this.role === 'influencer' ? new Date(Date.now() + 1 * 60 * 1000) : null; } },
  platformLinks: { type: [platformLinksSchema], required() { return ['influencer', 'brand'].includes(this.role); } },
  pricing: { type: [pricingSchema], required() { return this.role === 'influencer'; } },
  industry: { type: [industrySchema], required() { return this.role === 'brand'; } },
  numberOfProducts: { type: [String], enum: ['1-5', '5-10', '10-20', '20-50', '50+'], required() { return this.role === 'brand'; } },
  sizeOfCompany: { type: [String], enum: ['under 0.5 cr', '0.5-1 cr', '1-5 cr', '5-10 cr', '10-100 cr', '100+ cr'], required() { return this.role === 'brand'; } },
  brandInfo: { type: [brandInfoSchema], required() { return this.role === 'brand'; } },
}, { timestamps: true });

userSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
userSchema.pre('save', preSaveMiddleware);
userSchema.pre('findOneAndUpdate', preFindOneAndUpdateMiddleware);
userSchema.plugin(mongooseAggregatePaginate);

export const User = mongoose.model('User', userSchema);
