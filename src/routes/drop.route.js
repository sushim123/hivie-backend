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

route.get('/search', asyncHandler(searchDrops));
route.get('/active-drops', asyncHandler(getActiveDrops));
route.get('/stats', asyncHandler(getDropStats));
route.get('/adv-search', asyncHandler(advancedSearchDrops));
route.patch('/toggle-interested/:id', asyncHandler(toggleInterested));
route.get('/:id', asyncHandler(getDropsById));
route.put('/:id', asyncHandler(updateDrop));
route.delete('/:id', asyncHandler(deleteDrop));
route.post('/', asyncHandler(createDrop));
route.get('/', asyncHandler(getAllDrops));

export default route;
