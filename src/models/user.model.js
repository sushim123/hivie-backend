import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

// Platform Links Schema
const platformLinksSchema = new mongoose.Schema({
  youtube: { type: String, default: '' },
  tiktok: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  discord: { type: String, default: '' },
}, { timestamps: true });

// Pricing Schema
const pricingSchema = new mongoose.Schema({
  postPrice: { type: Number, required: true, min: 0 },
  reelPrice: { type: Number, required: true, min: 0 },
  brandRange: { 
    type: Number, 
    required: true, 
    enum: Array.from({ length: 10 }, (_, i) => i + 1) 
  },
}, { timestamps: true });


const industrySchema = new mongoose.Schema({
  industryType: {
    type: String,
    required: true,
    enum: [
      'Consumer Goods', 'Technology', 'Automotive', 'Healthcare', 
      'Finance', 'Retail', 'Food & Beverage', 'Media & Entertainment',
      'Energy & Utilities', 'Transportation & Logistics', 
      'Hospitality & Tourism', 'Real Estate', 'Telecommunications', 
      'Education & E-Learning', 'Aerospace & Defense'
    ]
  },
  industrySubtype: {
    type: String,
    required: true,
    enum: [
      'FMCG', 'Consumer Electronics', 'Fashion & Apparel', 'Beauty & Personal Care',
      'Software & Services', 'Hardware', 'Telecommunication',
      'Car Manufacturers', 'Motorcycles', 'Auto Parts & Accessories',
      'Pharmaceuticals', 'Medical Devices', 'Health Insurance',
      'Banks', 'Financial Services', 'Insurance',
      'Brick-and-Mortar Retail', 'E-Commerce',
      'Restaurants', 'Alcoholic Beverages', 'Non-Alcoholic Beverages',
      'Streaming Services', 'Traditional Media', 'Gaming',
      'Oil & Gas', 'Renewable Energy', 'Utilities',
      'Airlines', 'Shipping & Logistics',
      'Hotels & Resorts', 'Travel Agencies',
      'Residential & Commercial Real Estate',
      'Telecom Providers',
      'Online Learning Platforms', 'Traditional Educational Institutions',
      'Aerospace', 'Defense'
    ]
  }
}, { timestamps: true });


// User Schema
const userSchema = new mongoose.Schema({
  nickname: { type: String, required: [true, 'Nickname is required'] },
  name: { type: String, default: '' },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    unique: true,
    trim: true,
    index: true
  },
  refreshToken: { type: String, default: '' },
  role: {
    type: String,
    enum: ['admin', 'influencer', 'brand'],
    required: true,
    default: 'influencer'
  },
  picture: { type: String, default: '' },
  sid: { type: String, default: '' },
  given_name: { type: String, default: '' },
  family_name: { type: String, default: '' },
  sub: { type: String, default: '' },
  email_verified: { type: Boolean, default: false },
  isTemporary: {
    type: Boolean,
    default: function () {
      return this.role === 'influencer'; // True for influencers, false for brands
    }},
    expiresAt: {
      type: Date,
      default: function () {
        return this.role === 'influencer' ? new Date(Date.now() + 1 * 60 * 1000) : null; // Set only for influencers
      }
    },
  platformLinks: {
    type: [platformLinksSchema],
    required: function() { return this.role === 'influencer'; }  // Required for influencers
  },  
  pricing: {
    type: [pricingSchema],
    required: function() { return this.role === 'influencer'; }  // Required for influencers
  },
  industry: {
    type: [industrySchema],
    required: function() { return this.role === 'brand'; }  // Required for brands
  }
}, { timestamps: true });

userSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

userSchema.pre('save', function (next) {
  if (this.role === 'brand') {
    // Remove platformLinks and pricing for brands
    this.platformLinks = undefined;
    this.pricing = undefined;
  }
  if (this.role === 'influencer') {
    // Ensure expiresAt is set only for influencers
    this.isTemporary = true;
    this.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    this.industry = undefined;
  } else {
    // For brands
    this.isTemporary = false;
    this.expiresAt = null;
  }
  next();
});

userSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.role === 'brand') {
    update.platformLinks = undefined;
    update.pricing = undefined;
    update.isTemporary = false;
    update.expiresAt = null;
  } else if (update.role === 'influencer') {
    update.isTemporary = true;
    update.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes for influencer
  }
  next();
});



// Apply pagination plugin
userSchema.plugin(mongooseAggregatePaginate);

// Export models
export const User = mongoose.model('User', userSchema);
