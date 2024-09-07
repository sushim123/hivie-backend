// controllers/drop.controller.js
import {DUPLICATE_ERROR_CODE, END_OF_DAY, START_OF_DAY, STATUS_CODES} from '../constants.js';
import Drop from '../models/drop.model.js';
import {apiError} from '../utils/apiError.util.js';
import {apiResponse} from '../utils/apiResponse.util.js';
import {validateUserIds} from '../utils/validateSchema.util.js';
// Create a new drop
export const createDrop = async (req, res, next) => {
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
};

export const updateDrop = async (req, res, next) => {
  try {
    const {id} = req.params;
    const updates = req.body;

    // Find and update the drop in one step
    const updatedDrop = await Drop.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });

    // Handle case where drop was not found
    if (!updatedDrop) {
      return next(new apiError(STATUS_CODES.NOT_FOUND, 'Drop not found'));
    }

    res.json(new apiResponse(STATUS_CODES.OK, updatedDrop, 'Drop updated successfully', true));
  } catch (error) {
    next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to update drop', error));
  }
};

// Delete a drop
export const deleteDrop = async (req, res, next) => {
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
};

// Fetch all drops
export const getAllDrops = async (req, res, next) => {
  try {
    const fetchedDrops = await Drop.find({});
    if (!fetchedDrops.length) {
      return next(new apiError(STATUS_CODES.NOT_FOUND, 'No drops found'));
    }
    res.json(new apiResponse(STATUS_CODES.OK, fetchedDrops, 'Drops fetched successfully', true));
  } catch (error) {
    next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to fetch drops', error));
  }
};
// Fetch drops by ID
export const getDropsById = async (req, res, next) => {
  try {
    const {id} = req.params;
    const fetchedDrops = await Drop.find({"_id":id});
    if (!fetchedDrops.length) {
      return next(new apiError(STATUS_CODES.NOT_FOUND, 'No drops found by id ${id}'));
    }
    res.json(new apiResponse(STATUS_CODES.OK, fetchedDrops, `Drops fetched successfully by id ${id}`, true));
  } catch (error) {
    next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to fetch drops', error));
  }
};

// Get active drops
export const getActiveDrops = async (req, res, next) => {
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
};

// Fetch drop stats
export const getDropStats = async (req, res, next) => {
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
};

// Search drops
export const searchDrops = async (req, res, next) => {
  try {
    const {query, start_date, end_date} = req.query;

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
      ].filter(Boolean)
    };

    const drops = await Drop.find(searchQuery);
    res
      .status(STATUS_CODES.OK)
      .json(new apiResponse(STATUS_CODES.OK, drops, 'Search results fetched successfully', true));
  } catch (error) {
    next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to search drops', error));
  }
};

// Advanced search and sorting
export const advancedSearchDrops = async (req, res, next) => {
  try {
    const {type, dateField, sortOrder} = req.query;
    const validDateFields = ['start_date', 'end_date'];
    const validSortOrders = ['asc', 'desc'];
    let drops = [];

    if (type) {
      drops = await Drop.find({});
      const filteredDrops = drops
        .map((drop) => {
          drop.deliverables = drop.deliverables.filter((d) => d.deliverable_type === type);
          return drop;
        })
        .filter((drop) => drop.deliverables.length > 0);

      if (!filteredDrops.length) {
        return next(new apiError(STATUS_CODES.NOT_FOUND, `No drops with "${type}" deliverables found`));
      }

      drops = filteredDrops;
    }

    if (dateField && sortOrder) {
      if (!validDateFields.includes(dateField) || !validSortOrders.includes(sortOrder)) {
        return next(new apiError(STATUS_CODES.BAD_REQUEST, 'Invalid sort criteria'));
      }
      drops = drops.length ? drops : await Drop.find({});
      drops = drops.sort((a, b) =>
        a[dateField] > b[dateField] ? (sortOrder === 'desc' ? -1 : 1) : sortOrder === 'desc' ? 1 : -1
      );
    }

    if (!drops.length) {
      return next(new apiError(STATUS_CODES.BAD_REQUEST, 'Please provide valid query parameters'));
    }
    res.status(STATUS_CODES.OK).json(new apiResponse(STATUS_CODES.OK, drops, 'Drops fetched successfully', true));
  } catch (error) {
    next(new apiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'Failed to fetch drops', error));
  }
};

export const toggleInterested = async (req, res, next) => {
  try {
    const {id} = req.params;
    const {user_id} = req.body;
    if (user_id) validateUserIds(user_id);
    const drop = await Drop.findById(id);
    if (!drop) {
      return next(new apiError(STATUS_CODES.NOT_FOUND, 'Drop not found'));
    }
    const interestedIndex = await drop.interested_users.indexOf(user_id);
    if (interestedIndex === -1) {
      await drop.interested_users.push(user_id);
    } else {
      await drop.interested_users.splice(interestedIndex, 1);
    }
    await drop.save();
    res.json(new apiResponse(STATUS_CODES.OK, drop, 'Interested status updated successfully'));
  } catch (error) {
    next(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to toggle interested', error));
  }
}