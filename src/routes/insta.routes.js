import {Router} from 'express';
import {fetchDataByInstaAuth, fetchDataByUsername, getAuthInstaCode} from '../controllers/insta.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';

const route = Router();

route.get('/auth', getAuthInstaCode);
route.get('/auth/callback', fetchDataByInstaAuth);
route.get('/get-data/:username',isAuthenticated, fetchDataByUsername);

export default route;
