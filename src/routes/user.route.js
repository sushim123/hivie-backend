import {Router} from 'express';
import {createPlatformLinks, fetchPlatformLinks} from '../controllers/platformLinks.controller.js';
import {submitPricing} from '../controllers/pricingController.js';
import {
  calculateDigitalScore,
  deleteUser,
  fetchAllUser,
  fetchById,
  updateUser
} from '../controllers/user.controller.js';
import {isAdmin, isAuthenticated, isInfluencer} from '../middlewares/auth.middleware.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';
const router = Router();
// User Routes
// router.post('/user', asyncHandler(createUser));
router.get('/', isAuthenticated, isAdmin, asyncHandler(fetchAllUser));
router.get('/:id', isAuthenticated, isInfluencer, asyncHandler(fetchById));
router.put('/:id', isAuthenticated, isInfluencer, asyncHandler(updateUser));
router.delete('/:id', isAuthenticated, isAdmin, asyncHandler(deleteUser));
router.get('/score/:id', isAuthenticated, isInfluencer, asyncHandler(calculateDigitalScore));
// user charges per post and reel
router.post('/submit-pricing', submitPricing);
router.get('/submit-pricing/:id', asyncHandler(fetchById));
router.post('/highlights', createPlatformLinks);
router.get('/highlights/:userId', fetchPlatformLinks);
export default router;
