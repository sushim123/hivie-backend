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

// DELETE /api/v1/drops/:drop_id
route.delete(
  '/:drop_id',
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    try {
      const {drop_id} = req.params;
      const drop = await Drop.findByIdAndDelete(drop_id);

      if (!drop) {
        return next(new ApiError(404, 'Drop not found'));
      }

      res.status(200).json(new ApiResponse(200, null, 'Drop deleted successfully', true));
    } catch (error) {
      next(new ApiError(500, 'Failed to delete drop', error));
    }
  })
);

// GET /api/v1/drops/search
route.get(
  '/search',
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    try {
      const {query, start_date, end_date} = req.query;
      const searchQuery = {
        $and: [
          {title: new RegExp(query, 'i')},
          {start_date: {$gte: new Date(start_date)}},
          {end_date: {$lte: new Date(end_date)}}
        ]
      };

      const drops = await Drop.find(searchQuery);
      res.status(200).json(new ApiResponse(200, drops, 'Search results fetched successfully', true));
    } catch (error) {
      next(new ApiError(500, 'Failed to search drops', error));
    }
  })
);

// GET /api/v1/drops
route.get(
  '/',
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    try {
      const {page = 1, limit = 10, sort = 'start_date'} = req.query;
      const drops = await Drop.paginate({}, {page, limit, sort});
      res.status(200).json(new ApiResponse(200, drops, 'Drops fetched successfully with pagination', true));
    } catch (error) {
      next(new ApiError(500, 'Failed to fetch drops with pagination', error));
    }
  })
);

// GET /api/v1/drops/stats
route.get(
  '/stats',
  isAuthenticated,
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

// PATCH /api/v1/drops/:drop_id/status
route.patch(
  '/:drop_id/status',
  isAuthenticated,
  asyncHandler(async (req, res, next) => {
    try {
      const {drop_id} = req.params;
      const {status} = req.body;

      const drop = await Drop.findByIdAndUpdate(drop_id, {status}, {new: true});

      if (!drop) {
        return next(new ApiError(404, 'Drop not found'));
      }

      res.status(200).json(new ApiResponse(200, drop, 'Drop status updated successfully', true));
    } catch (error) {
      next(new ApiError(500, 'Failed to update drop status', error));
    }
  })
);

export default route;
