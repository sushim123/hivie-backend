import { STATUS_CODES } from '../constants.js';
import { getAuthToken } from '../helpers/getAuthToken.helper.js';
import { apiResponse } from '../utils/apiResponse.util.js';
import {User} from '../models/user.model.js';
// import { updatePricing } from '../controllers/userController.js';
export const fetchAuthenticationInfluencer = async (req, res, next) => {
  try {
    res.send(
      new apiResponse(
        STATUS_CODES.OK,
        req.oidc.isAuthenticated(),
        'User login status fetched successfully',
        true
      )
    );
  } catch (error) {
    next(new apiResponse(STATUS_CODES.BAD_REQUEST, 'Failed to fetch user login status', error));
  }
};

// OAuth access token
export const fetchInfluenderAuthenticationAccessToken = async (req, res, next) => {
  try {
    const accessToken = await getAuthToken();
    res.send(new apiResponse(STATUS_CODES.OK, accessToken, 'Token fetched successfully', true));
  } catch (error) {
    next(new apiResponse(STATUS_CODES.BAD_REQUEST, 'Failed to fetch access token', error));
  }
};

export const fetchProfileOfInfluencer = async (req, res, next) => {
  try {
    const user = req.oidc.user;
    let dbUser = await User.findOne({ email: user.email });

    if (!dbUser) {

      dbUser = new User({
        name: user.name,
        email: user.email,
        isTemporary: true // Mark user as temporary
      });
      await dbUser.save();
    } else if (dbUser.isTemporary) {
      dbUser.isTemporary = true;
      await dbUser.save();
    }

  //   res.send(new apiResponse(STATUS_CODES.OK, user, 'Dashboard fetched successfully', true));
  // }

  //res.send ko change karke res.render kar diya (influencerProfile) aur json me pass na karte simple html me pass kiya from schema
    res.render('influencerProfile', {
      user: dbUser,  // Pass the user data to the template
      message: 'Dashboard fetched successfully',
    });}
     catch (error) {
    next(new apiResponse(STATUS_CODES.BAD_REQUEST, 'Failed to fetch profile', error));
  }
};

export const logoutInfluender = async (req, res, next) => {
  try {
    const user = req.oidc.user;
    if (user) {
      // Mark user as non-temporary upon logout if they are fully authorized
      const dbUser = await User.findOne({ email: user.email });
      if (dbUser && dbUser.isTemporary) {
        dbUser.isTemporary = false;
        await dbUser.save();
      }
    }

    req.oidc.logout(); // Clear the session and logout the user
    res.send(new apiResponse(STATUS_CODES.OK, null, 'User logged out successfully', true));
  } catch (error) {
    next(new apiResponse(STATUS_CODES.BAD_REQUEST, 'Failed to log out user', error));
  }
};

