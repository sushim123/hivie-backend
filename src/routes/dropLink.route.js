import {Router} from 'express';
import {
  createDropLink,
  deleteDropLink,
  getAllDropLinks,
  getDropLinkById,
  updateDropLink
} from '../controllers/dropLink.controller.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';
const route = Router();
route.post('/', asyncHandler(createDropLink));
// GET /api/v1/drop-link/
route.get('/', asyncHandler(getAllDropLinks));
// GET /api/v1/drop-link/:id
route.get('/:id', asyncHandler(getDropLinkById));
// PUT /api/v1/drop-link/:id
route.put('/:id', asyncHandler(updateDropLink));
// DELETE /api/v1/drop-link/:id
route.delete('/:id', asyncHandler(deleteDropLink));

export default route;
