import {Router} from 'express';
import pkg from 'express-openid-connect';
import {isAuthenticatedBrand} from '../middlewares/auth.middleware.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';
import { fetchAuthenticationinflu, fetchProfileOfinflu, logininflu, logoutinflu } from '../controllers/influ.controller.js';
const {requiresAuth} = pkg;
const route = Router();
// Route to check if the brand is authenticated
route.get('/',requiresAuth(),asyncHandler(fetchAuthenticationinflu));
//Route to login as brand
route.get('/login', asyncHandler (logininflu));
// Route to display the brands profile information
route.get('/profile',asyncHandler(fetchProfileOfinflu));
//Route to logout as Brand
route.get('/logout', requiresAuth(), asyncHandler (logoutinflu));

export default route;