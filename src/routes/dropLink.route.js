import {Router} from 'express';
import dropLink from '../models/dropLink.model.js';
import {apiError} from '../utils/apiError.util.js';
import {apiResponse} from '../utils/apiResponse.util.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';
import { STATUS_CODES } from '../constants.js';

const route = Router();

route.post(
  '/',
  asyncHandler(async (req, res, next) => {
    try {
      const { drop_id, brand_id, deliverables, user_id } = req.body;
      const newDropLink = new dropLink({
        drop_id,
        brand_id,
        deliverables,
        user_id,
      });
      await newDropLink.save();
      res.status(STATUS_CODES.CREATED).json(new apiResponse(STATUS_CODES.CREATED, newDropLink, 'Drop link saved successfully', true));
    } catch (error) {
      if (error.code === DUPLICATE_ERROR_CODE) { // Duplicate key error code
        return next(new apiError(STATUS_CODES.CONFLICT, 'Duplicate drop link entry'));
      }
      next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to save drop link', error));
    }
  })
);


// GET /api/v1/drop-link/
route.get(
  '/',
  asyncHandler(async (req, res, next) => {
    try {
      const newDropLink = await dropLink.find();
      if (!newDropLink) {
        return next(new apiError(STATUS_CODES.NOT_FOUND, 'Drop link not found'));
      }
      res.status(STATUS_CODES.OK).json(new apiResponse(STATUS_CODES.OK, newDropLink, 'Drop link fetched successfully'));
    } catch (error) {
      next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to fetch drop link', error));
    }
  })
);
// GET /api/v1/drop-link/:id
route.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    try {
      const newDropLink = await dropLink.findById(req.params.id);
      if (!newDropLink) {
        return next(new apiError(STATUS_CODES.NOT_FOUND, 'Drop link not found'));
      }
      res.status(STATUS_CODES.OK).json(new apiResponse(STATUS_CODES.OK, newDropLink, 'Drop link fetched successfully', true));
    } catch (error) {
      next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to fetch drop link', error));
    }
  })
);

// PUT /api/v1/drop-link/:id
route.put(
  '/:id',
  asyncHandler(async (req, res, next) => {
    try {
      const {id} = req.params;

      // Search for the drop link by either _id or drop_id
      const updatedDropLink = await dropLink.findOneAndUpdate({$or: [{_id: id}, {drop_id: id}]}, req.body, {
        new: true,
        runValidators: true
      });
      if (!updatedDropLink) {
        return next(new apiError(STATUS_CODES.NOT_FOUND, 'Drop link not found'));
      }
      res.status(STATUS_CODES.OK).json(new apiResponse(STATUS_CODES.OK, updatedDropLink, 'Drop link updated successfully', true));
    } catch (error) {
      next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to update drop link', error));
    }
  })
);

// DELETE /api/v1/drop-link/:id
route.delete(
  '/:id',
  asyncHandler(async (req, res, next) => {
    try {
      const deletedDropLink = await dropLink.findByIdAndDelete(req.params.id);
      if (!deletedDropLink) {
        return next(new apiError(STATUS_CODES.NOT_FOUND, 'Drop link not found'));
      }
      res.status(STATUS_CODES.OK).json(new apiResponse(STATUS_CODES.OK, deletedDropLink, 'Drop link deleted successfully', true));
    } catch (error) {
      next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to delete drop link', error));
    }
  })
);

export default route;
