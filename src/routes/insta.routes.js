import {Router} from 'express';
import {fetchDataByInstaAuth, fetchAndLinkData, getAuthInstaCode} from '../controllers/insta.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const route = Router();

route.get('/auth', getAuthInstaCode);
route.get('/auth/callback', fetchDataByInstaAuth);
route.get('/get-link-data/:username',isAuthenticated, fetchAndLinkData);

export default route;