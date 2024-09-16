import {Router} from 'express';
import {fetchDataByInstaAuth, fetchAndLinkData, getAuthInstaCode} from '../controllers/insta.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

import {fetchDataByInstaAuth, fetchDataByUsername, getAuthInstaCode} from '../controllers/insta.controller.js';
import { isAuthenticatedBrand } from '../middlewares/auth.middleware.js';
const route = Router();
route.get('/auth', getAuthInstaCode);
route.get('/auth/callback', fetchDataByInstaAuth);
route.get('/get-link-data/:username',isAuthenticated, fetchAndLinkData);
route.get('/get-data/:username',isAuthenticatedBrand, fetchDataByUsername);

export { route as pricingRoutes };

export default route;