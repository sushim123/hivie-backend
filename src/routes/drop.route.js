// routes/drop.routes.js
import {Router} from 'express';
import {
  advancedSearchDrops,
  createDrop,
  deleteDrop,
  getActiveDrops,
  getAllDrops,
  getDropsById,
  getDropStats,
  searchDrops,
  toggleInterested,
  updateDrop
} from '../controllers/drop.controller.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';

const route = Router();

route.post('/', asyncHandler(createDrop));

route.put('/:id', asyncHandler(updateDrop));

route.delete('/:id', asyncHandler(deleteDrop));

route.get('/active-drops', asyncHandler(getActiveDrops));

route.get('/stats', asyncHandler(getDropStats));

route.get('/:id', asyncHandler(getDropsById));

route.get('/', asyncHandler(getAllDrops));

route.get('/search', asyncHandler(searchDrops));

route.get('/adv-search', asyncHandler(advancedSearchDrops));

route.patch('/toggle-interested/:id', asyncHandler(toggleInterested));

export default route;
