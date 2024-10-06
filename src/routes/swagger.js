// Route to check if the user is authenticated
/**
 * @swagger
 * /:
 *   get:
 *     summary: Check user authentication
 *     tags: [Influencer]
 *     responses:
 *       200: { description: User is authenticated }
 *       400: { description: Unauthorized }
 */

// Route to log in
/**
 * @swagger
 * /api/login:
 *   get:
 *     summary: Log in
 *     tags: [Influencer]
 *     responses:
 *       302: { description: Redirect to login page }
 *       403: { description: Unauthorized }
 */

// Route to display user profile
/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Influencer]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200: { description: Profile fetched }
 *       401: { description: Unauthorized }
 */

// Route to log out user
/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Log out user
 *     tags: [Influencer]
 *     security: [ { bearerAuth: [] } ]
 *     responses:
 *       200: { description: Logged out successfully }
 *       400: { description: Logout failed }
 */

// Instagram authorization
/**
 * @swagger
 * /api/v1/insta/auth:
 *   get:
 *     summary: Instagram OAuth authorization
 *     tags: [Instagram]
 *     responses:
 *       302: { description: Redirect to Instagram }
 *       400: { description: Code not found }
 */

// Instagram auth callback
/**
 * @swagger
 * /api/v1/insta/auth/callback:
 *   get:
 *     summary: Handle Instagram auth callback
 *     tags: [Instagram]
 *     parameters:
 *       - in: query
 *         name: code
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Auth success }
 *       401: { description: Unauthorized }
 *       500: { description: Error fetching data }
 */

// Fetch Instagram data by username
/**
 * @swagger
 * /api/v1/insta/get-link-data/{username}:
 *   get:
 *     summary: Fetch Instagram data
 *     tags: [Instagram]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Data fetched successfully }
 *       400: { description: Invalid request }
 *       502: { description: Username not provided }
 */

// Submit user pricing details
/**
 * @swagger
 * /api/v1/user/submit-pricing:
 *   post:
 *     summary: Submit pricing details
 *     tags: [Influencer pricing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       200: { description: Pricing updated }
 *       400: { description: Invalid input }
 *       404: { description: User not found }
 *       500: { description: Server error }
 */

// Submit platform highlights
/**
 * @swagger
 * /api/v1/user/highlights:
 *   post:
 *     summary: Submit platform highlights
 *     tags: [Influencer pricing]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object }
 *     responses:
 *       302: { description: Highlights updated }
 *       400: { description: Invalid request }
 *       404: { description: User not found }
 *       500: { description: Server error }
 */

/**
 * @swagger
 * /api/v1/e-commerce/category:
 *   post:
 *     summary: Add a new category
 *     tags: [E-commerce]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Electronics
 *               description:
 *                 type: string
 *                 example: All electronic items
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Category name is required
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/v1/e-commerce/product:
*   post:
 *     tags:
 *        [E-commerce]
 *     summary: Add a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               category_id:
 *                 type: string
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/e-commerce/flashSale:
 *   post:
 *     tags:
 *       [E-commerce]
 *     summary: Add a new flash sale
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *               discount_percentage:
 *                 type: number
 *               start_time:
 *                 type: string
 *                 format: date-time
 *               end_time:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Flash sale created
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/v1/e-commerce/cart:
 *   post:
 *     tags:
 *      [E-commerce]
 *     summary: Create a new cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cart created
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/e-commerce/cart/item:
 *   post:
 *     tags:
 *        [E-commerce]
 *     summary: Add an item to the cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *               quantity:
 *                 type: number
 *               cart_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Cart item added
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */


/**
 * @swagger
 * /api/v1/e-commerce/order:
 *   post:
 *     tags:
 *      [E-commerce]
 *     summary: Create a new order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               total_amount:
 *                 type: number
 *               payment_method:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price_at_purchase:
 *                       type: number
 *     responses:
 *       201:
 *         description: Order has been created successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
