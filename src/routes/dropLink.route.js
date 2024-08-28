import {Router} from 'express';
import dropLink from '../models/dropLink.model.js';
import {apiError} from '../utils/apiError.util.js';
import {apiResponse} from '../utils/apiResponse.util.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';

const route = Router();

// POST /api/v1/drop-link/
route.post(
  '/',
  asyncHandler(async (req, res, next) => {
    try {
      const {drop_id, brand_id, deliverables, user_id} = req.body;
      const newDropLink = new dropLink({
        drop_id,
        brand_id,
        deliverables,
        user_id
      });
      await newDropLink.save();
      res.status(201).json(new apiResponse(201, newDropLink, 'Project link saved successfully', true));
    } catch (error) {
      next(new apiError(500, 'Failed to save drop link', error));
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
          return next(new apiError(404, 'Project link not found'));
        }
        res.status(200).json(new apiResponse(200, newDropLink, 'Project link fetched successfully'));
      } catch (error) {
        next(new apiError(500, 'Failed to fetch drop link', error));
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
        return next(new apiError(404, 'Project link not found'));
      }
      res.status(200).json(new apiResponse(200, newDropLink, 'Project link fetched successfully', true));
    } catch (error) {
      next(new apiError(500, 'Failed to fetch drop link', error));
    }
  })
);


// PUT /api/v1/drop-link/:id
route.put(
  '/:id',
  asyncHandler(async (req, res, next) => {
    try {
      const { id } = req.params;

      // Search for the project link by either _id or drop_id
      const updatedProjectLink = await dropLink.findOneAndUpdate(
        { $or: [{ _id: id }, { drop_id: id }] },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );
      if (!updatedProjectLink) {
        return next(new apiError(404, 'Project link not found'));
      }
      res.status(200).json(new apiResponse(200, updatedProjectLink, 'Project link updated successfully', true));
    } catch (error) {
      next(new apiError(500, 'Failed to update project link', error));
    }
  })
);

// DELETE /api/v1/drop-link/:id
route.delete(
  '/:id',
  asyncHandler(async (req, res, next) => {
    try {
      const deletedProjectLink = await dropLink.findByIdAndDelete(req.params.id);
      if (!deletedProjectLink) {
        return next(new apiError(404, 'Project link not found'));
      }
      res.status(200).json(new apiResponse(200, deletedProjectLink, 'Project link deleted successfully', true));
    } catch (error) {
      next(new apiError(500, 'Failed to delete drop link', error));
    }
  })
);

export default route;
