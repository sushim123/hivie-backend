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
import { addIndustryTypeAndSubtype,

    addOrUpdateNumberOfProducts,

    addOrUpdateSizeOfCompany,

    createOrUpdateBrandInfo,

    fetchBrandInfo,

    //  deleteIndustryTypeAndSubtype,
     fetchIndustryTypesAndSubtypes,
     fetchNumberOfProducts,
     fetchSizeOfCompany,
    //   updateIndustryTypeAndSubtype

} from '../controllers/industry.controller.js';
// Route to check if the brand is authenticated
route.get('/',requiresAuth(),isAuthenticatedBrand,asyncHandler(fetchAuthenticationBrand));
//Route to login as brand
route.get('/login', asyncHandler (loginBrand));
// Route to display the brands profile information
route.get('/profile', isAuthenticatedBrand,asyncHandler(fetchProfileOfbrand) );
//Route to logout as Brand
route.get('/logout', requiresAuth(), asyncHandler (logoutBrand));
// Industry routes
route.get('/industry' , fetchIndustryTypesAndSubtypes);
route.post('/industry',addIndustryTypeAndSubtype);

// route.put('/industry/:id' ,updateIndustryTypeAndSubtype);
// route.delete('/industry/:id',deleteIndustryTypeAndSubtype);

// Number of products routes
route.get('/number-of-products', fetchNumberOfProducts);
route.post('/number-of-products', addOrUpdateNumberOfProducts);
// Size of company routes
route.get('/size-of-company', fetchSizeOfCompany);
route.post('/size-of-company', addOrUpdateSizeOfCompany);
// Brand info routes
route.get('/brand-info', asyncHandler(fetchBrandInfo));
// Route to update brand info
route.post('/brand-info', (createOrUpdateBrandInfo));
export default route;