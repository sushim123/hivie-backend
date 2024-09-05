import {Router} from 'express';
import {END_OF_DAY, START_OF_DAY, STATUS_CODES} from '../constants.js';
import Drop from '../models/drop.model.js';
import {apiError} from '../utils/apiError.util.js';
import {apiResponse} from '../utils/apiResponse.util.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';

const route = Router();

// Route to add a new drop
route.post(
  '/',
  asyncHandler(async (req, res, next) => {
    try {
      const {brand_id, title, description, cover_image, payout, start_date, end_date, deliverables} = req.body;
      // Validate deliverables according to their type
      const validatedDeliverables = deliverables.map((deliverable) => {
        if (deliverable.deliverable_type === 'reel') {
          if (!deliverable.details.title || typeof deliverable.details.time_duration !== 'number') {
            throw new apiError(STATUS_CODES.BAD_REQUEST, 'Invalid reel details');
          }
        } else if (deliverable.deliverable_type === 'post') {
          if (!deliverable.details.title || !deliverable.details.description) {
            throw new apiError(STATUS_CODES.BAD_REQUEST, 'Invalid post details');
          }
        }
        return deliverable;
      });

      const newDrop = new Drop({
        brand_id,
        title,
        description,
        cover_image,
        payout,
        start_date,
        end_date,
        deliverables: validatedDeliverables // Fixed variable name here
      });

      await newDrop.save();
      res.json(new apiResponse(STATUS_CODES.CREATED, newDrop, 'Drop created successfully', true));
    } catch (error) {
      next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to create drop', error));
    }
  })
);

// Route to update the drop
route.put(
  '/:id',
  asyncHandler(async (req, res, next) => {
    try {
      const {id} = req.params;
      const updates = req.body;

      // Validate deliverables in updates
      if (updates.deliverables) {
        const validatedDeliverables = updates.deliverables.map((deliverable) => {
          if (deliverable.deliverable_type === 'reel') {
            if (!deliverable.details.title || typeof deliverable.details.time_duration !== 'number') {
              throw new apiError(STATUS_CODES.BAD_REQUEST, 'Invalid reel details');
            }
          } else if (deliverable.deliverable_type === 'post') {
            if (!deliverable.details.title || !deliverable.details.description) {
              throw new apiError(STATUS_CODES.BAD_REQUEST, 'Invalid post details');
            }
          }
          return deliverable;
        });
        updates.deliverables = validatedDeliverables;
      }

      const updatedDrop = await Drop.findOneAndUpdate({_id: id}, updates, {
        new: true,
        runValidators: true
      });

      if (!updatedDrop) {
        return next(new apiError(STATUS_CODES.NOT_FOUND, 'Drop not found'));
      }
      res.json(new apiResponse(STATUS_CODES.OK, updatedDrop, 'Drop updated successfully', true));
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error code
        next(new apiError(STATUS_CODES.CONFLICT, 'Duplicate entry: This drop already exists', error));
      } else {
        next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to update drop', error));
      }
    }
  })
);

// Route to delete the drop
route.delete(
  '/:id',
  asyncHandler(async (req, res, next) => {
    try {
      const {id} = req.params;
      const drop = await Drop.findOneAndDelete({_id: id});
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

// Route to get stats
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
      res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, stats, 'Drop stats fetched successfully', true));
    } catch (error) {
      next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to fetch drop stats', error));
    }
  })
);

// Route to get all drops in DB
route.get(
  '/',
  asyncHandler(async (req, res, next) => {
    try {
      const fetchedDrops = await Drop.find({});
      if (!fetchedDrops.length) {
        return next(new apiError(STATUS_CODES.NOT_FOUND, 'No drops found'));
      }
      res.json(new apiResponse(STATUS_CODES.OK, fetchedDrops, 'Drops fetched successfully', true));
    } catch (error) {
      next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to fetch drops', error));
    }
  })
);

// Route to search drops
route.get(
  '/search',
  asyncHandler(async (req, res, next) => {
    try {
      const {query, start_date, end_date} = req.query;

      // Convert start_date and end_date to ISO format
      const startDate = start_date ? new Date(`${start_date}${START_OF_DAY}`) : undefined;
      const endDate = end_date ? new Date(`${end_date}${END_OF_DAY}`) : undefined;
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
      res
        .status(STATUS_CODES.OK)
        .json(new apiResponse(STATUS_CODES.OK, drops, 'Search results fetched successfully', true));
    } catch (error) {
      next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to search drops', error));
    }
  })
);

// Route to get a drop by ID
route.get(
  '/:id',
  asyncHandler(async (req, res, next) => {
    try {
      const id = req.params.id;
      const fetchedDrop = await Drop.findById(id);
      if (!fetchedDrop) {
        return next(new apiError(STATUS_CODES.NOT_FOUND, `No drop with ID ${id} found`));
      }
      res.json(new apiResponse(STATUS_CODES.OK, fetchedDrop, 'Drop fetched successfully', true));
    } catch (error) {
      next(new apiError(STATUS_CODES.BAD_REQUEST, `Failed to fetch drop with ID ${id}`, error));
    }
  })
);

export default route;
