import {Router} from 'express';
import {isAuthenticated} from '../middlewares/auth.middleware.js';
import {Drop} from '../models/drop.model.js';
import {ApiError} from '../utils/ApiError.util.js';
import {ApiResponse} from '../utils/ApiResponse.util.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';

const route = Router();

// Route to add a new drop
route.post(
  '/add-drop',
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
      res.json(new ApiResponse(201, newDrop, 'Drop created successfully', true));
    } catch (error) {
      next(new ApiError(500, 'Failed to create drop', error));
    }
  })
);
// Route to update the drop.
route.put(
  '/update-drop/:id',
  asyncHandler(async (req, res, next) => {
    try {
      const {id} = req.params;
      const updates = req.body;
      const updatedDrop = await Drop.findOneAndUpdate({$or: [{drop_id: id}, {_id: id}]}, updates, {
        new: true
      });
      if (!updatedDrop) {
        return next(new ApiError(404, 'Drop not found'));
      }
      res.json(new ApiResponse(200, updatedDrop, 'Drop updated successfully', true));
    } catch (error) {
      next(new ApiError(500, 'Failed to update drop', error));
    }
  })
);
//route to delete the drop
route.delete(
  'delete/:id',
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    try {
      const {id} = req.params;
      const drop = await Drop.findOneAndDelete({$or: [{drop_id: id}, {_id: id}]});

      if (!drop) {
        return next(new ApiError(404, 'Drop not found'));
      }

      res.status(200).json(new ApiResponse(200, null, 'Drop deleted successfully', true));
    } catch (error) {
      next(new ApiError(500, 'Failed to delete drop', error));
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
        return next(new ApiError(404, 'No active drops found'));
      }

      res.json(new ApiResponse(200, activeDrops, 'Active drops fetched successfully', true));
    } catch (error) {
      next(new ApiError(500, 'Failed to fetch active drops', error));
    }
  })
);

//get all drops in db
route.get(
  '/all-drops',
  asyncHandler(async (req, res, next) => {
    try {
      const currentDate = new Date();
      const activeDrops = await Drop.find({});
      if (!activeDrops.length) {
        return next(new ApiError(404, 'No active drops found'));
      }
      res.json(new ApiResponse(200, activeDrops, 'Active drops fetched successfully', true));
    } catch (error) {
      next(new ApiError(500, 'Failed to fetch active drops', error));
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
      res.status(200).json(new ApiResponse(200, stats, 'Drop stats fetched successfully', true));
    } catch (error) {
      next(new ApiError(500, 'Failed to fetch drop stats', error));
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

      // Convert end_date to end of the day (23:59:59.999Z) in ISO format
      const endDate = end_date ? new Date(`${end_date}T23:59:59.999Z`) : undefined;

      // Build the search query
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
      res.status(200).json(new ApiResponse(200, drops, 'Search results fetched successfully', true));
    } catch (error) {
      next(new ApiError(500, 'Failed to search drops', error));
    }
  })
);

export default route;
