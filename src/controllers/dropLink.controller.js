import {STATUS_CODES, DUPLICATE_ERROR_CODE} from '../constants.js';
import {apiResponse} from '../utils/apiResponse.util.js';
import {apiError} from '../utils/apiError.util.js';
import {fetchMediaDataFromPermalink} from '../helpers/instagram.helper.js';
import DropLink from '../models/dropLink.model.js';

export const createDropLink = async (req, res, next) => {
  const {drop_id, brand_id, deliverables, user_id} = req.body;
  try {
    const deliverablesWithMediaData = await Promise.all(
      deliverables.map(async (deliverable) => {
        const mediaData = await fetchMediaDataFromPermalink(deliverable.link);
        // console.log('Fetched media data:', mediaData); // Log the media data
        return {
          ...deliverable,
          media: mediaData ? [mediaData] : []
        };
      })
    );
    // console.log('Deliverables with media data:', deliverablesWithMediaData);

    const newDropLink = new DropLink({
      drop_id,
      brand_id,
      deliverables: deliverablesWithMediaData,
      user_id
    });
    await newDropLink.save();
    res
      .status(STATUS_CODES.CREATED)
      .json(new apiResponse(STATUS_CODES.CREATED, newDropLink, 'Drop link saved successfully', true));
  } catch (error) {
    if (error.code === DUPLICATE_ERROR_CODE) {
      return next(new apiError(STATUS_CODES.CONFLICT, 'Duplicate drop link entry'));
    }
    next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to save drop link', error));
  }
};
export const getAllDropLinks = async (req, res, next) => {
  try {
    const newDropLink = await DropLink.find();
    if (!newDropLink) {
      return next(new apiError(STATUS_CODES.NOT_FOUND, 'Drop link not found'));
    }
    res.status(STATUS_CODES.OK).json(new apiResponse(STATUS_CODES.OK, newDropLink, 'Drop link fetched successfully'));
  } catch (error) {
    next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to fetch drop link', error));
  }
};
export const getDropLinkById = async (req, res, next) => {
  try {
    const newDropLink = await DropLink.findById(req.params.id);
    if (!newDropLink) {
      return next(new apiError(STATUS_CODES.NOT_FOUND, 'Drop link not found'));
    }
    res
      .status(STATUS_CODES.OK)
      .json(new apiResponse(STATUS_CODES.OK, newDropLink, 'Drop link fetched successfully', true));
  } catch (error) {
    next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to fetch drop link', error));
  }
};
export const updateDropLink = async (req, res, next) => {
  try {
    const {id} = req.params;

    // Search for the drop link by _id
    const updatedDropLink = await DropLink.findOneAndUpdate({_id: id}, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedDropLink) {
      return next(new apiError(STATUS_CODES.NOT_FOUND, 'Drop link not found'));
    }
    res
      .status(STATUS_CODES.OK)
      .json(new apiResponse(STATUS_CODES.OK, updatedDropLink, 'Drop link updated successfully', true));
  } catch (error) {
    next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to update drop link', error));
  }
};
export const deleteDropLink = async (req, res, next) => {
  try {
    const deletedDropLink = await DropLink.findByIdAndDelete(req.params.id);
    if (!deletedDropLink) {
      return next(new apiError(STATUS_CODES.NOT_FOUND, 'Drop link not found'));
    }
    res
      .status(STATUS_CODES.OK)
      .json(new apiResponse(STATUS_CODES.OK, deletedDropLink, 'Drop link deleted successfully', true));
  } catch (error) {
    next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to delete drop link', error));
  }
};
