import {User} from '../models/user.model.js';
import {ApiError} from '../utils/ApiError.util.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';

// export const isAuthenticated = (req, res, next) => {
//   if (req.oidc.isAuthenticated()) return next();
//   next(new ApiError(401, 'You are unauthorized, Please Login'));
// };
export const isAuthenticated = asyncHandler(async (req, res, next) => {
  if (req.oidc.isAuthenticated()) {
    const {email} = req.oidc.user;
    let user = await User.findOne({email});
    if (!user) {
      user = await new User(req.oidc.user);
      await user.save();
    }
    req.user = user;
    return next();
  }
  next(new ApiError(401, 'Please login', ['Unautherized']));
});
export const isInfluencer = (req, res, next) => {
  if (req.user.role === 'influencer' || req.user.role === 'admin' ) return next();
  next(new ApiError(401, 'This is not for influencer', ['Unautherized']));
};

export const isBrand = (req, res, next) => {
  if (req.user.role === 'brand'|| req.user.role === 'admin') return next();
  next(new ApiError(401, 'This is only for brands', ['Unautherized']));
};

export const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') next();
  next(new ApiError(401, 'This is only for admin', ['Unautherized']));
};
