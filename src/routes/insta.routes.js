import {Router} from 'express';
import {fetchDataByInstaAuth, fetchDataByUsername, getAuthInstaCode} from '../controllers/insta.controller.js';
import { submitPricing } from '../controllers/pricingController.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';
import { fetchById } from '../controllers/user.controller.js';
import { createPlatformLinks, fetchPlatformLinks } from '../controllers/platformLinks.controller.js';
import { isAuthenticatedBrand } from '../middlewares/auth.middleware.js';
const route = Router();
route.get('/auth', getAuthInstaCode);
route.get('/auth/callback', fetchDataByInstaAuth);
route.get('/get-data/:username',isAuthenticatedBrand, fetchDataByUsername);
route.post('/submit-pricing', submitPricing);
route.get('/submit-pricing/:id', asyncHandler(fetchById));
route.post('/highlights', createPlatformLinks);
route.get('/highlights/:userId',fetchPlatformLinks);
export { route as pricingRoutes };

export default route;
