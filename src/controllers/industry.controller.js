import {STATUS_CODES} from '../constants.js';
import {User} from '../models/user.model.js';
import {apiError} from '../utils/apiError.util.js';
import {apiResponse} from '../utils/apiResponse.util.js';
const validIndustryTypesAndSubtypes = {
  'Consumer Goods': ['FMCG', 'Consumer Electronics', 'Fashion & Apparel', 'Beauty & Personal Care'],
  Technology: ['Software & Services', 'Hardware', 'Telecommunication'],
  Automotive: ['Car Manufacturers', 'Motorcycles', 'Auto Parts & Accessories'],
  Healthcare: ['Pharmaceuticals', 'Medical Devices', 'Health Insurance'],
  Finance: ['Banks', 'Financial Services', 'Insurance'],
  Retail: ['Brick-and-Mortar Retail', 'E-Commerce'],
  'Food & Beverage': ['Restaurants', 'Alcoholic Beverages', 'Non-Alcoholic Beverages'],
  'Media & Entertainment': ['Streaming Services', 'Traditional Media', 'Gaming'],
  'Energy & Utilities': ['Oil & Gas', 'Renewable Energy', 'Utilities'],
  'Transportation & Logistics': ['Airlines', 'Shipping & Logistics'],
  'Hospitality & Tourism': ['Hotels & Resorts', 'Travel Agencies'],
  'Real Estate': ['Residential & Commercial Real Estate'],
  Telecommunications: ['Telecom Providers'],
  'Education & E-Learning': ['Online Learning Platforms', 'Traditional Educational Institutions'],
  'Aerospace & Defense': ['Aerospace', 'Defense']
};

const isValidIndustry = (type, subtype) => validIndustryTypesAndSubtypes[type]?.includes(subtype);

export const fetchIndustryTypesAndSubtypes = async (req, res) => {
  try {
    // Fetch industry data from the User model
    const users = await User.find().select('industry.industryType industry.industrySubtype').lean();
    const industries = users.map((user) => user.industry);
    res.send(new apiResponse(STATUS_CODES.OK, industries, 'Industry types and subtypes fetched successfully', true));
  } catch (error) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send(
        new apiError(
          STATUS_CODES.INTERNAL_SERVER_ERROR,
          null,
          `Failed to fetch industry types and subtypes: ${error.message}`,
          false
        )
      );
  }
};

export const addIndustryTypeAndSubtype = async (req, res) => {
  const {userId, industryType, industrySubtype} = req.body; // Make sure to provide userId

  if (!userId) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json(new apiResponse(STATUS_CODES.BAD_REQUEST, null, 'User ID is required', false));
  }

  if (!isValidIndustry(industryType, industrySubtype)) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json(new apiResponse(STATUS_CODES.BAD_REQUEST, null, 'Invalid industry type or subtype', false));
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json(new apiResponse(STATUS_CODES.NOT_FOUND, null, 'User not found', false));
    }

    // Check if the industry type and subtype already exist for this user
    if (
      user.industry &&
      user.industry.industryType === industryType &&
      user.industry.industrySubtype === industrySubtype
    ) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json(
          new apiResponse(STATUS_CODES.BAD_REQUEST,null,'Industry type and subtype already exist for this user',false));
    }

    user.industry = {industryType, industrySubtype};
    await user.save();
    res
      .status(STATUS_CODES.CREATED)
      .json(new apiResponse(STATUS_CODES.CREATED, user, 'Industry type and subtype added successfully', true));
  } catch (error) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json(new apiError (STATUS_CODES.INTERNAL_SERVER_ERROR,null,`Failed to add industry type and subtype: ${error.message}`,false));
  }
};
export const updateIndustryTypeAndSubtype = async (req, res) => {
  const {id} = req.params;
  const {industryType, industrySubtype} = req.body;
  if (!isValidIndustry(industryType, industrySubtype)) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json(new apiResponse(STATUS_CODES.BAD_REQUEST, null, 'Invalid industry type or subtype', false));
  }

  try {
  
    const existingUser = await User.findOne({
      'industry.industryType': industryType,
      'industry.industrySubtype': industrySubtype,
      _id: {$ne: id}
    })
    .lean();
    if (existingUser) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json(
          new apiError(STATUS_CODES.BAD_REQUEST,null,
            'Another industry with the same type and subtype already exists with this Id',false));
    }


    // Update the user's industry information
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {'industry.industryType': industryType, 'industry.industrySubtype': industrySubtype},
      {new: true}
    ).lean();
    if (!updatedUser) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json(new apiResponse(STATUS_CODES.NOT_FOUND, null, 'User with industry type and subtype not found', false));
    }

    res.send(new apiResponse(STATUS_CODES.OK, updatedUser, 'Industry type and subtype updated successfully', true));
  } catch (error) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send(
        new apiResponse(
          STATUS_CODES.INTERNAL_SERVER_ERROR,
          null,
          `Failed to update industry type and subtype: ${error.message}`,
          false
        )
      );
  }
};

export const deleteIndustryTypeAndSubtype = async (req, res) => {
  const {id} = req.params;

  try {
    // Delete the user's industry information
    const deletedUser = await User.findByIdAndUpdate(id, {$unset: {industry: 1}}, {new: true}).lean();
    if (!deletedUser) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json(new apiResponse(STATUS_CODES.NOT_FOUND, null, 'User with industry type and subtype not found', false));
    }

    res.send(new apiResponse(STATUS_CODES.OK, deletedUser, 'Industry type and subtype deleted successfully', true));
  } catch (error) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .send(
        new apiResponse(
          STATUS_CODES.INTERNAL_SERVER_ERROR,
          null,
          `Failed to delete industry type and subtype: ${error.message}`,
          false
        )
      );
  }
};
