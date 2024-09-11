import {Router} from 'express';
import pkg from 'express-openid-connect';
import {isAuthenticatedBrand} from '../middlewares/auth.middleware.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';
import 
{   fetchAuthenticationBrand, 
    fetchProfileOfbrand, 
    loginBrand, 
    logoutBrand 
} from '../controllers/brand.controller.js'
const {requiresAuth} = pkg;
const route = Router();
import { addIndustryTypeAndSubtype, deleteIndustryTypeAndSubtype, fetchIndustryTypesAndSubtypes, updateIndustryTypeAndSubtype } from '../controllers/industry.controller.js';
// Route to check if the brand is authenticated
route.get('/',requiresAuth(),isAuthenticatedBrand,asyncHandler(fetchAuthenticationBrand));
//Route to login as brand
route.get('/login', asyncHandler (loginBrand));

// Route to display the brands profile information
route.get('/profile', isAuthenticatedBrand,asyncHandler(fetchProfileOfbrand) );

//Route to logout as Brand
route.get('/logout', requiresAuth(), asyncHandler (logoutBrand));
export default route;

route.get('/industry' , fetchIndustryTypesAndSubtypes);

route.post('/industry',addIndustryTypeAndSubtype);

route.put('/industry/:id' ,updateIndustryTypeAndSubtype);
route.delete('/industry/:id',deleteIndustryTypeAndSubtype);