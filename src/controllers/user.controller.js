import {SCORE_WEIGHT, STATUS_CODES} from '../constants.js';
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
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate('instaData');

    if (!user?.instaData?.data) {
      return res.status(404).json({ message: 'User or Instagram data not found' });
    }

    const { followers_count, follows_count } = user.instaData.data;
    const { totalComments = 0, totalLikes = 0, totalShares = 0, totalCountOfMediaInSevenDays = 0 } = user.instaData.data.metrics || {};

    if (followers_count <= 0) {
      return res.status(400).json({ message: 'Invalid follower count' });
    }
    const engagementRate = ((totalComments + totalLikes + totalShares) / followers_count) * 100;
    const followerToFollowingRatio = follows_count > 0 ? followers_count / follows_count : 0;
    const contentConsistency = totalCountOfMediaInSevenDays;
    const contentQuality = totalCountOfMediaInSevenDays > 0 ? totalLikes / totalCountOfMediaInSevenDays : 0;

    const rawScore =
      engagementRate * SCORE_WEIGHT.ENGAGEMENT_RATE +
      followerToFollowingRatio * SCORE_WEIGHT.FOLLOWER_FOLLOWING_RATIO +
      contentConsistency * SCORE_WEIGHT.CONTENT_CONSISTENCY +
      contentQuality * SCORE_WEIGHT.CONTENT_QUALITY;

    res.json({follows_count, followers_count, engagementRate, followerToFollowingRatio, contentConsistency, contentQuality, rawScore});
  } catch (error) {
    next(error);
  }
};
