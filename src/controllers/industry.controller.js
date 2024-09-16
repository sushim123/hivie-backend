import { STATUS_CODES, VALID_INDUSTRY_TYPES_AND_SUBTYPES } from '../constants.js';
import { User } from '../models/user.model.js';
import { apiError } from '../utils/apiError.util.js';
import { apiResponse } from '../utils/apiResponse.util.js';

const validIndustryTypesAndSubtypes = VALID_INDUSTRY_TYPES_AND_SUBTYPES;

const validRanges = {
  numberOfProducts: ['1-5', '5-10', '10-20', '20-50', '50+'],
  sizeOfCompany: ['under 0.5 cr', '0.5-1 cr', '1-5 cr', '5-10 cr', '10-100 cr', '100+ cr']
};

const validReasonsForOnboarding = ['Search and discovery', 'Quick campaigns'];
const isValidIndustry = (type, subtype) => validIndustryTypesAndSubtypes[type]?.includes(subtype);
const isValidRange = (rangeType, range) => validRanges[rangeType]?.includes(range);

const handleValidationError = (res, message) => {
  res.status(STATUS_CODES.BAD_REQUEST).json(new apiResponse(STATUS_CODES.BAD_REQUEST, null, message, false));
};

const handleFetch = async (res, field, type) => {
  try {
    const users = await User.find().select(field).lean();
    const data = users.map((user) => user[type]);
    res.status(STATUS_CODES.OK).json(new apiResponse(STATUS_CODES.OK, data, `${type.replace(/([A-Z])/g, ' $1')} fetched successfully`, true));
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new apiError(STATUS_CODES.INTERNAL_SERVER_ERROR, null, `Failed to fetch ${type.replace(/([A-Z])/g, ' $1')}: ${error.message}`, false));
  }
};

const handleUpdate = async (res, userId, field, value, validRangeType) => {
  if (!isValidRange(validRangeType, value)) {
    return handleValidationError(res, `Invalid ${validRangeType} range`);
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(STATUS_CODES.NOT_FOUND).json(new apiResponse(STATUS_CODES.NOT_FOUND, null, 'User not found', false));
    }

    if (user[field] !== value) {
      user[field] = value;
      await user.save();
    }

    res.status(STATUS_CODES.OK).json(new apiResponse(STATUS_CODES.OK, user, `${validRangeType.replace(/([A-Z])/g, ' $1')} added/updated successfully`, true));
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new apiError(STATUS_CODES.INTERNAL_SERVER_ERROR, null, `Failed to add/update ${validRangeType.replace(/([A-Z])/g, ' $1')}: ${error.message}`, false));
  }
};

export const fetchIndustryTypesAndSubtypes = async (req, res) => {
  handleFetch(res, 'industry.industryType industry.industrySubtype', 'industry');
};

export const addIndustryTypeAndSubtype = async (req, res) => {
  const { userId, industryType, industrySubtype } = req.body;

  if (!userId) return handleValidationError(res, 'User ID is required');
  if (!isValidIndustry(industryType, industrySubtype)) return handleValidationError(res, 'Invalid industry type or subtype');

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(STATUS_CODES.NOT_FOUND).json(new apiResponse(STATUS_CODES.NOT_FOUND, null, 'User not found', false));

    if (user.industry && user.industry.industryType === industryType && user.industry.industrySubtype === industrySubtype) {
      return handleValidationError(res, 'Industry type and subtype already exist for this user');
    }

    user.industry = { industryType, industrySubtype };
    await user.save();
    res.status(STATUS_CODES.CREATED).json(new apiResponse(STATUS_CODES.CREATED, user, 'Industry type and subtype added successfully', true));
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new apiError(STATUS_CODES.INTERNAL_SERVER_ERROR, null, `Failed to add industry type and subtype: ${error.message}`, false));
  }
};

export const addOrUpdateNumberOfProducts = async (req, res) => {
  const { userId, numberOfProducts } = req.body;
  handleUpdate(res, userId, 'numberOfProducts', numberOfProducts, 'numberOfProducts');
};

export const fetchNumberOfProducts = async (req, res) => {
  handleFetch(res, 'numberOfProducts', 'numberOfProducts');
};

export const addOrUpdateSizeOfCompany = async (req, res) => {
  const { userId, sizeOfCompany } = req.body;
  handleUpdate(res, userId, 'sizeOfCompany', sizeOfCompany, 'sizeOfCompany');
};

export const fetchSizeOfCompany = async (req, res) => {
  handleFetch(res, 'sizeOfCompany', 'sizeOfCompany');
};


export const createOrUpdateBrandInfo = async (req, res) => {
  const { userId, brandInfo } = req.body;

  if (!userId) return handleValidationError(res, 'User ID is required');
  if (!validReasonsForOnboarding.includes(brandInfo.reasonForOnboarding)) {
    return handleValidationError(res, 'Invalid reason for onboarding');
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(STATUS_CODES.NOT_FOUND).json(new apiResponse(STATUS_CODES.NOT_FOUND, null, 'User not found', false));

    if (user.role !== 'brand') return handleValidationError(res, 'Only brands can have brand info');

    // Ensure that the brandInfo object matches the schema
    user.brandInfo = {
      socialMediaPlatformLinks: brandInfo.platformLinks,
      reasonForOnboarding: brandInfo.reasonForOnboarding
    };
    await user.save();

    res.status(STATUS_CODES.OK).json(new apiResponse(STATUS_CODES.OK, user.brandInfo, 'Brand info added/updated successfully', true));
  } catch (error) {
    console.error(`Failed to add/update brand info: ${error.message}`);
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new apiError(STATUS_CODES.INTERNAL_SERVER_ERROR, null, `Failed to add/update brand info: ${error.message}`, false));
  }
};


export const fetchBrandInfo = async (req, res) => {
  try {
    const users = await User.find({ role: 'brand' }).select('brandInfo').lean(); 

    const brandInfoData = users.map((user) => user.brandInfo);

    res.status(STATUS_CODES.OK).json(new apiResponse(STATUS_CODES.OK, brandInfoData, 'Brand info fetched successfully', true));
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new apiError(STATUS_CODES.INTERNAL_SERVER_ERROR, null, `Failed to fetch brand info: ${error.message}`, false));
  }
};





// export const updateIndustryTypeAndSubtype = async (req, res) => {
//   const {id} = req.params;
//   const {industryType, industrySubtype} = req.body;
//   if (!isValidIndustry(industryType, industrySubtype)) {
//     return res
//       .status(STATUS_CODES.BAD_REQUEST)
//       .json(new apiResponse(STATUS_CODES.BAD_REQUEST, null, 'Invalid industry type or subtype', false));
//   }

//   try {

//     const existingUser = await User.findOne({
//       'industry.industryType': industryType,
//       'industry.industrySubtype': industrySubtype,
//       _id: {$ne: id}
//     })
//     .lean();
//     if (existingUser) {
//       return res
//         .status(STATUS_CODES.BAD_REQUEST)
//         .json(
//           new apiError(STATUS_CODES.BAD_REQUEST,null,
//             'Another industry with the same type and subtype already exists with this Id',false));
//     }


//     // Update the user's industry information
//     const updatedUser = await User.findByIdAndUpdate(
//       id,
//       {'industry.industryType': industryType, 'industry.industrySubtype': industrySubtype},
//       {new: true}
//     ).lean();
//     if (!updatedUser) {
//       return res
//         .status(STATUS_CODES.NOT_FOUND)
//         .json(new apiResponse(STATUS_CODES.NOT_FOUND, null, 'User with industry type and subtype not found', false));
//     }

//     res.send(new apiResponse(STATUS_CODES.OK, updatedUser, 'Industry type and subtype updated successfully', true));
//   } catch (error) {
//     res
//       .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
//       .send(
//         new apiResponse(
//           STATUS_CODES.INTERNAL_SERVER_ERROR,
//           null,
//           `Failed to update industry type and subtype: ${error.message}`,
//           false
//         )
//       );
//   }
// };

// export const deleteIndustryTypeAndSubtype = async (req, res) => {
//   const {id} = req.params;

//   try {
//     // Delete the user's industry information
//     const deletedUser = await User.findByIdAndUpdate(id, {$unset: {industry: 1}}, {new: true}).lean();
//     if (!deletedUser) {
//       return res
//         .status(STATUS_CODES.NOT_FOUND)
//         .json(new apiResponse(STATUS_CODES.NOT_FOUND, null, 'User with industry type and subtype not found', false));
//     }

//     res.send(new apiResponse(STATUS_CODES.OK, deletedUser, 'Industry type and subtype deleted successfully', true));
//   } catch (error) {
//     res
//       .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
//       .send(
//         new apiResponse(
//           STATUS_CODES.INTERNAL_SERVER_ERROR,
//           null,
//           `Failed to delete industry type and subtype: ${error.message}`,
//           false
//         )
//       );
//   }
// };
