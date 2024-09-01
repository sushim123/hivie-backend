import { STATUS_CODES } from 'http';
import {User} from '../models/user.model.js';
import {apiError} from '../utils/apiError.util.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';

// Middleware to check authentication and create user if not exists
export const isAuthenticated = asyncHandler(async (req, res, next) => {
  if (req.oidc.isAuthenticated()) {
    const {email} = req.oidc.user;
    let user = await User.findOne({email});

    if (!user) {
      user = new User(req.oidc.user);
      await user.save();
    }

    req.user = user;
    return next();
  }

  // Unauthorized access
  next(new apiError(STATUS_CODES.UNAUTHORIZED, 'Please login', ['Unauthorized']));
});

// Middleware to check if user is an influencer or admin
export const isInfluencer = (req, res, next) => {
  if (req.user.role === 'influencer' || req.user.role === 'admin') {
    return next();
  }

  // Unauthorized access
  next(new apiError(401, 'This is not for influences', ['Unauthorized']));
};

// Middleware to check if user is a brand or admin
export const isBrand = (req, res, next) => {
  if (req.user.role === 'brand' || req.user.role === 'admin') {
    return next();
  }

  // Unauthorized access
  next(new apiError(401, 'This is only for brands', ['Unauthorized']));
};

// Middleware to check if user is an admin
export const isAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    return next();
  }

  // Unauthorized access
  next(new apiError(401, 'This is only for admins', ['Unauthorized']));
};
