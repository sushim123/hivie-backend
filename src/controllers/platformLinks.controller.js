import { User } from '../models/user.model.js';
import { STATUS_CODES } from '../constants.js';
export const createPlatformLinks = async (req, res) => {
  try {
    const { email, youtube, tiktok, linkedin, discord } = req.body;
    if (!email) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Email is required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'User not found' });
    }
    const existingLinks = user.platformLinks.find(links => links.email === email);
    if (existingLinks) {
      Object.assign(existingLinks, { youtube, tiktok, linkedin, discord });
    } 
    else {
      user.platformLinks.push({ email, youtube, tiktok, linkedin, discord });
    }
    await user.save();
    res.status(STATUS_CODES.OK).json(user.platformLinks);
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
  }
};
export const fetchPlatformLinks = async (req, res) => {
  try {
    const { email } = req.params;
    if (!email) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({ message: 'Email is required' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json({ message: 'User not found' });
    }
    res.status(STATUS_CODES.OK).json(user.platformLinks);
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({ message: 'Server error', error });
  }
};
