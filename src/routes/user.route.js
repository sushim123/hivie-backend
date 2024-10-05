import {Router} from 'express';
import {createPlatformLinks, dashboard, fetchPlatformLinks} from '../controllers/platformLinks.controller.js';
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
router.get('/blank', (req, res) => {
  res.render('platformLinks', {
    errorMessage: null,
    platformLinks: [],
    successMessage: null
  });
});
router.get('/dashboard', isAuthenticated, asyncHandler(dashboard));
router.get('/', isAuthenticated, isAdmin, asyncHandler(fetchAllUser));
router.get('/:id', isAuthenticated, isInfluencer, asyncHandler(fetchById));
router.put('/:id', isAuthenticated, isInfluencer, asyncHandler(updateUser));
router.delete('/:id', isAuthenticated, isAdmin, asyncHandler(deleteUser));
router.get('/score/:id', isAuthenticated, asyncHandler(calculateDigitalScore));
// user charges per post and reel
router.post('/submit-pricing', isAuthenticated, asyncHandler(submitPricing));
router.post('/highlights', asyncHandler(createPlatformLinks));
router.get('/highlights/:userId',isAuthenticated, asyncHandler (fetchPlatformLinks));

export default router;
