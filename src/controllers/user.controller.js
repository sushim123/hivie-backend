import {User} from '../models/user.model.js';
import {STATUS_CODES} from '../constants.js';

// export const createUser = async (req, res) => {
//     try {
//       const newUser = new User(req.body);
//       await newUser.save();
//       res.status(STATUS_CODES.CREATED).json(newUser);
//     } catch (err) {
//       res.status(STATUS_CODES.BAD_REQUEST).json(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to add newUser', err, false));
//     }
//   };

export const fetchById =async (req, res) => {
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
  }