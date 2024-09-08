import {Router} from 'express';
import {fetchDataByInstaAuth, fetchDataByUsername, getAuthInstaCode} from '../controllers/insta.controller.js';

const route = Router();

route.get('/auth', getAuthInstaCode);
route.get('/auth/callback', fetchDataByInstaAuth);
route.get('/get-data/:username', fetchDataByUsername);

export default route;
