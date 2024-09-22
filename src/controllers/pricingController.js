import { STATUS_CODES } from '../constants.js';
import { apiResponse } from '../utils/apiResponse.util.js';
import { User } from '../models/user.model.js';
import { apiError} from '../utils/apiError.util.js'

export const submitPricing = async (req, res, next) => {
  const { email, postPrice, reelPrice, brandRange } = req.body;
  try {
    if (isNaN(postPrice) || isNaN(reelPrice)) {
      return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json(new apiResponse(STATUS_CODES.BAD_REQUEST,'Post price and reel price must be numbers'
      ));
    }
  const validBrandCollabRanges = Array.from({ length: 10 }, (_, i) => i + 1);
    if (!validBrandCollabRanges.includes(brandRange)) {
      return res.status(STATUS_CODES.BAD_REQUEST).json(new apiResponse(STATUS_CODES.BAD_REQUEST,`Brand range must be one of the following: ${validBrandCollabRanges.join(',')}`
      ));
    }
  const user = await User.findOne({ email });
    if (!user) {
      return res
      .status(STATUS_CODES.NOT_FOUND)
      .json(new apiResponse( STATUS_CODES.NOT_FOUND,'User not found'
      ));
    }
  const pricingData = { postPrice, reelPrice, brandRange };
  const pricingIndex = user.pricing.findIndex(pricing => pricing.brandRange === brandRange);
    if (pricingIndex !== -1) {
      user.pricing[pricingIndex] = { ...user.pricing[pricingIndex], ...pricingData };
    }
    else {
      user.pricing.push(pricingData);
    }
    await user.save();
    res
    .status(STATUS_CODES.OK)
    .json(new apiResponse(STATUS_CODES.OK,{ message: 'Pricing updated successfully', data: pricingData },
     ));
    } catch (error) {
      next(new apiError (STATUS_CODES.INTERNAL_SERVER_ERROR,'Failed to update pricing',error,false));
    }
    };
