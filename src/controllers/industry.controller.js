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

    return { success: true, message: `${validRangeType.replace(/([A-Z])/g, ' $1')} added/updated successfully` };
  } catch (error) {
    return { success: false, errorMessage: `Failed to add/update ${validRangeType.replace(/([A-Z])/g, ' $1')}: ${error.message}` };
  }
};


export const fetchIndustryTypesAndSubtypes = async (req, res) => {
  try {
    // Fetching industry data from the `VALID_INDUSTRY_TYPES_AND_SUBTYPES`
    const industryData = Object.entries(validIndustryTypesAndSubtypes).map(([type, subtypes]) => ({
      industryType: type,
      industrySubtypes: subtypes,
    }));

    // Render the form with the fetched industry data
    res.render('addIndustryBrand', {
      errorMessage: null,
      successMessage: null,
      industryData // Pass the industry data to the view
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(
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
  const { email, industryType, industrySubtype } = req.body;

  // Helper function to render the form with dynamic industry data
  const renderForm = (errorMessage = null, successMessage = null) => {
    return res.render('addIndustryBrand', {
      errorMessage,
      successMessage,
      industryData: Object.entries(validIndustryTypesAndSubtypes).map(([type, subtypes]) => ({
        industryType: type,
        industrySubtypes: subtypes,
      }))
    });
  };

  if (!email) {
    return renderForm('Email is required');
  }

  if (!isValidIndustry(industryType, industrySubtype)) {
    return renderForm('Invalid industry type or subtype');
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return renderForm('User not found');
    }

    if (user.industry && user.industry.industryType === industryType && user.industry.industrySubtype === industrySubtype) {
      return renderForm('Industry type and subtype already exist for this user');
    }

    user.industry = { industryType, industrySubtype };
    await user.save();

    return res.redirect('/api/v1/brand/number-of-products');

  } catch (error) {
    return renderForm(`Failed to add industry type and subtype: ${error.message}`);
  }
};

export const addOrUpdateNumberOfProducts = async (req, res) => {
  const { userId, numberOfProducts } = req.body;

  try {
    const updateResult = await handleUpdate(res, userId, 'numberOfProducts', numberOfProducts, 'numberOfProducts');

    if (updateResult.success) {
      return res.redirect('/api/v1/brand/size-of-company');
    } else {
      return res.render('updateNumberOfProducts', {
        successMessage: null,
        errorMessage: updateResult.errorMessage
      });
    }
  } catch (error) {
    console.error("Error updating number of products:", error);
    return res.render('updateNumberOfProducts', {
      successMessage: null,
      errorMessage: "An unexpected error occurred. Please try again."
    });
  }
};


export const fetchNumberOfProducts = async (req, res) => {
  try {
    const users = await User.find().select('numberOfProducts').lean();
    const numberOfProductsData = users.map(user => user.numberOfProducts || 'No data available');

    res.render('numberOfProducts', {
      numberOfProductsData,
      errorMessage: null,
      successMessage: 'Number of Products fetched successfully!'
    });
  } catch (error) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json(new apiError(STATUS_CODES.INTERNAL_SERVER_ERROR, null, `Failed to fetch number of products: ${error.message}`, false));
  }
};

export const addOrUpdateSizeOfCompany = async (req, res) => {
  const { userId, sizeOfCompany } = req.body;

  try {
    const updateResult = await handleUpdate(res, userId, 'sizeOfCompany', sizeOfCompany, 'sizeOfCompany');

    if (updateResult.success) {
      return res.redirect('brand-info');
    } else {
      return res.render('updateSizeOfCompany', {
        successMessage: null,
        errorMessage: updateResult.errorMessage,
        sizeOfCompanyOptions: ['under 0.5 cr', '0.5-1 cr', '1-5 cr', '5-10 cr', '10-100 cr', '100+ cr']
      });
    }
  } catch (error) {
    console.error("Error updating size of company:", error);
    return res.render('updateSizeOfCompany', {
      successMessage: null,
      errorMessage: "An unexpected error occurred. Please try again.",
      sizeOfCompanyOptions: ['under 0.5 cr', '0.5-1 cr', '1-5 cr', '5-10 cr', '10-100 cr', '100+ cr']
    });
  }
};
export const fetchSizeOfCompany = async (req, res) => {
  res.render('updateSizeOfCompany', {
    sizeOfCompanyOptions: ['under 0.5 cr', '0.5-1 cr', '1-5 cr', '5-10 cr', '10-100 cr', '100+ cr'],
    successMessage: null,
    errorMessage: null
  });
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

export const renderIndustryForm = (req, res) => {
  res.render('addIndustryBrand', {
    errorMessage: null,
    successMessage: null
  });
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
