import {Router} from 'express';
import {
  fetchAndLinkData,
  fetchDataByInstaAuth,
  fetchDataByUsername,
  getAuthInstaCode
} from '../controllers/insta.controller.js';
import {isAuthenticated, isAuthenticatedBrand} from '../middlewares/auth.middleware.js';
const route = Router();

/**
 * @swagger
 * /api/v1/insta/auth:
 *   get:
 *     summary: Redirect to Instagram authorization page.
 *     description: Redirects user to Instagram for OAuth authorization.
 *     tags:
 *       - Instagram
 *     responses:
 *       302:
 *         description: Redirect to Instagram's authorization page.
 *       400:
 *         description: Bad Request - Code not found.
 */

route.get('/auth', getAuthInstaCode);
/**
 * @swagger
 * paths:
 *   /api/v1/insta/auth/callback:
 *     get:
 *       summary: Handle Instagram authentication callback
 *       description: Exchanges authorization code for an access token and fetches user data.
 *       tags:
 *         - Instagram
 *       parameters:
 *         - in: query
 *           name: code
 *           schema:
 *             type: string
 *           required: true
 *           description: Authorization code from Instagram.
 *       responses:
 *         '200':
 *           description: Success - Renders Instagram auth result with user info.
 *           content:
 *             text/html:
 *               schema:
 *                 type: string
 *                 example: "<html><body>Instagram auth success</body></html>"
 *         '401':
 *           description: Unauthorized - Email not found or user not authenticated.
 *           content:
 *             text/html:
 *               schema:
 *                 type: string
 *                 example: "<html><body>Unauthorized access</body></html>"
 *         '500':
 *           description: Error - Failed to fetch Instagram data.
 *           content:
 *             text/html:
 *               schema:
 *                 type: string
 *                 example: "<html><body>Error fetching data. Please try again.</body></html>"
 */

route.get('/auth/callback', fetchDataByInstaAuth);

/**
 * @swagger
 * paths:
 *   /api/v1/insta/get-link-data/{username}:
 *     get:
 *       summary: Fetch and link Instagram data for a user
 *       description: Retrieves business info and media data for the provided username, updates existing records or creates new ones in the database.
 *       tags:
 *         - Instagram
 *       parameters:
 *         - in: path
 *           name: username
 *           schema:
 *             type: string
 *           required: true
 *           description: The Instagram username to fetch data for.
 *       responses:
 *         '200':
 *           description: Success - User data updated or created successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "success"
 *                   data:
 *                     type: object
 *                     description: The Instagram data object or updated user data.
 *                   message:
 *                     type: string
 *                     example: "User's data fetched and stored successfully."
 *         '400':
 *           description: Bad Request - Invalid request or username not found.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "error"
 *                   message:
 *                     type: string
 *                     example: "Error fetching or saving data."
 *         '502':
 *           description: Bad Gateway - Username not provided.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "error"
 *                   message:
 *                     type: string
 *                     example: "Please provide a username."
 */

route.get('/get-link-data/:username', isAuthenticated, fetchAndLinkData);

/**
 * @swagger
 * paths:
 *   /api/v1/insta/get-data/{username}:
 *     get:
 *       summary: Fetch Instagram data for a user by username
 *       description: Retrieves the latest business info and media data for the specified username, updating existing records or creating new ones in the database.
 *       tags:
 *         - Instagram
 *       security:
 *         - Bearer: []
 *       parameters:
 *         - in: path
 *           name: username
 *           schema:
 *             type: string
 *           required: true
 *           description: The Instagram username to fetch data for.
 *       responses:
 *         '200':
 *           description: Success - User data updated or created successfully.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "success"
 *                   data:
 *                     type: object
 *                     description: The Instagram data object or updated user data.
 *                   message:
 *                     type: string
 *                     example: "User data updated with the latest information."
 *         '400':
 *           description: Bad Request - Invalid request or error fetching data.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "error"
 *                   message:
 *                     type: string
 *                     example: "Error fetching or saving data."
 *         '502':
 *           description: Bad Gateway - Username not provided.
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   status:
 *                     type: string
 *                     example: "error"
 *                   message:
 *                     type: string
 *                     example: "Please provide a username."
 */

route.get('/get-data/:username', isAuthenticatedBrand, fetchDataByUsername);

export {route as pricingRoutes};

export default route;
