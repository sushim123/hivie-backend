import {Router} from 'express';
import {isAuthenticated} from '../middlewares/auth.middleware.js';
import {Drop} from '../models/drop.model.js';
import {apiError} from '../utils/apiError.util.js';
import {apiResponse} from '../utils/apiResponse.util.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';
import { DUPLICATE_ERROR_CODE, STATUS_CODES } from '../constants.js';

const route = Router();

// Route to add a new drop
route.post(
  '/',
  asyncHandler(async (req, res, next) => {
    try {
      const {brand_id, title, description, cover_image, payout, start_date, end_date, deliverables} = req.body;

      const newDrop = new Drop({
        brand_id,
        title,
        description,
        cover_image,
        payout,
        start_date,
        end_date,
        deliverables
      });
      await newDrop.save();
      res.json(new apiResponse(STATUS_CODES.CREATED, newDrop, 'Drop created successfully', true));
    } catch (error) {
      next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to create drop', error));
    }
  })
);
// Route to update the drop.
route.put(
  '/:id',
  asyncHandler(async (req, res, next) => {
    try {
      const {id} = req.params;
      const updates = req.body;
      const updatedDrop = await Drop.findOneAndUpdate({$or: [{drop_id: id}, {_id: id}]}, updates, {
        new: true
      });
      if (!updatedDrop) {
        return next(new apiError(STATUS_CODES.NOT_FOUND, 'Drop not found'));
      }
      res.json(new apiResponse(STATUS_CODES.OK, updatedDrop, 'Drop updated successfully', true));
    } catch (error) {
      if (error.code === 11000) {
        // Handle duplicate key error
        next(new apiError(STATUS_CODES.CONFLICT, 'Duplicate entry: This drop already exists', error));
      } else {
        // Handle other errors
        next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to create drop', error));
      }
    }
  })
);
//route to delete the drop
route.delete(
  '/:id',
  // isAuthenticated,
  asyncHandler(async (req, res, next) => {
    try {
      const {id} = req.params;
      const drop = await Drop.findOneAndDelete({$or: [{drop_id: id}, {_id: id}]});
      if (!drop) {
        return next(new apiError(STATUS_CODES.NOT_FOUND, 'Drop not found'));
      }
      res.status(STATUS_CODES.OK).json(new apiResponse(STATUS_CODES.OK, null, 'Drop deleted successfully', true));
    } catch (error) {
      next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to delete drop', error));
    }
  })
);

// Route to get active drops (within valid start_date and end_date)
route.get(
  '/active-drops',
  asyncHandler(async (req, res, next) => {
    try {
      const currentDate = new Date();

      const activeDrops = await Drop.find({
        start_date: {$lte: currentDate},
        end_date: {$gte: currentDate}
      });
      if (!activeDrops.length) {
        return next(new apiError(STATUS_CODES.NOT_FOUND, 'No active drops found'));
      }
      res.json(new apiResponse(STATUS_CODES.OK, activeDrops, 'Active drops fetched successfully', true));
    } catch (error) {
      next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to fetch active drops', error));
    }
  })
);

//get all drops in db
route.get(
  '/',
  asyncHandler(async (req, res, next) => {
    try {
      const currentDate = new Date();
      const activeDrops = await Drop.find({});
      if (!activeDrops.length) {
        return next(new apiError(STATUS_CODES.NOT_FOUND, 'No active drops found'));
      }
      res.json(new apiResponse(STATUS_CODES.OK, activeDrops, 'Active drops fetched successfully', true));
    } catch (error) {
      next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to fetch active drops', error));
    }
  })
);

// GET /api/v1/drops/stats
route.get(
  '/stats',
  asyncHandler(async (req, res, next) => {
    try {
      const totalDrops = await Drop.countDocuments();
      const activeDrops = await Drop.countDocuments({
        start_date: {$lte: new Date()},
        end_date: {$gte: new Date()}
      });
      const totalPayout = await Drop.aggregate([{$group: {_id: null, total: {$sum: '$payout'}}}]);
      const stats = {
        totalDrops,
        activeDrops,
        totalPayout: totalPayout[0]?.total || 0
      };
      res.status(STATUS_CODES.OK).json(new apiResponse(STATUS_CODES.OK, stats, 'Drop stats fetched successfully', true));
    } catch (error) {
      next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to fetch drop stats', error));
    }
  })
);

// GET /api/v1/drops/search
route.get(
  '/search',
  asyncHandler(async (req, res, next) => {
    try {
      const {query, start_date, end_date} = req.query;

      // Convert start_date to start of the day (00:00:00.000Z) in ISO format
      const startDate = start_date ? new Date(`${start_date}T00:00:00.000Z`) : undefined;
      const endDate = end_date ? new Date(`${end_date}T23:59:59.999Z`) : undefined;
      const searchQuery = {
        $and: [
          {
            $or: [
              {title: {$regex: query, $options: 'i'}},
              {description: {$regex: query, $options: 'i'}},
              {'deliverables.deliverable_type': {$regex: query, $options: 'i'}},
              {'deliverables.details.title': {$regex: query, $options: 'i'}}
            ]
          },
          startDate ? {start_date: {$gte: startDate}} : {},
          endDate ? {end_date: {$lte: endDate}} : {}
        ].filter(Boolean) // Remove empty conditions
      };
      const drops = await Drop.find(searchQuery);
      res.status(STATUS_CODES.OK).json(new apiResponse(STATUS_CODES.OK, drops, 'Search results fetched successfully', true));
    } catch (error) {
      next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to search drops', error));
    }
  })
);

export default route;
