import {STATUS_CODES} from '../constants.js';
import {User} from '../models/user.model.js';

// export const createUser = async (req, res) => {
//     try {
//       const newUser = new User(req.body);
//       await newUser.save();
//       res.status(STATUS_CODES.CREATED).json(newUser);
//     } catch (err) {
//       res.status(STATUS_CODES.BAD_REQUEST).json(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to add newUser', err, false));
//     }
//   };

export const fetchById = async (req, res) => {
  try {
    const newUser = await User.findById(req.params.id);
    if (!newUser) return res.status(STATUS_CODES.NOT_FOUND).json({message: 'User not found'});
    res.json(newUser);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
};
export const fetchAllUser = async (req, res) => {
  try {
    const newUsers = await User.find();
    res.json(newUsers);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
};
export const updateUser = async (req, res) => {
  try {
    const newUser = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!newUser) return res.status(STATUS_CODES.NOT_FOUND).json({message: 'User not found'});
    res.json(newUser);
  } catch (err) {
    res.status(STATUS_CODES.BAD_REQUEST).json({message: err.message});
  }
};
export const deleteUser = async (req, res) => {
  try {
    const newUser = await User.findByIdAndDelete(req.params.id);
    if (!newUser) return res.status(STATUS_CODES.NOT_FOUND).json({message: 'User not found'});
    res.json({message: 'User deleted'});
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
};

export const calculateDigitalScore = async (req, res, next) => {
  const response = await User.findById(req.params.id).populate('instaData');
  const instaUserData = response?.instaData?.data;
  const {follower,following}=instaUserData;
  const {total_comments_count, total_like_count, total_share_count} = instaUserData?.metrics;
  const engagementRate = ((total_comments_count + total_like_count + total_share_count) / follower) * 100;
  const followerToFollowingRatio = follower / following;
  const contentConsistency = 0;// no. of post in last 7 days.
  const contentQuality = 0;// avg likes per post.
};
