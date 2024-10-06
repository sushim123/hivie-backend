import express from 'express';
import {
  addCategoryName,
  addFlashSaleProduct,
  addItemToCart,
  addProduct,
  createCart,
  createOrder,
  // createUserAddress,
  // deleteUSerAddress,
  // fetchAddressById,
  fetchAllCategory,
  fetchAllItemsInCart,
  fetchAllProducts,
  fetchCategoryById,
  fetchFlashSaleProductById,
  fetchOrderById,
  fetchOrderByUserId,
  fetchProductById,
  getAllFlashSaleProduct,
  updateOrderStatus
} from '../controllers/eCommerce.controller.js';
import {isAdmin, isAuthenticated} from '../middlewares/auth.middleware.js';
import {asyncHandler} from '../utils/asyncHandler.util.js';
const router = express.Router();

// //address Routes
// router.post('/user/:id/address', asyncHandler(createUserAddress));
// router.get('/user/:id/address', asyncHandler(fetchAddressById));
// router.put('/address/:addressId', asyncHandler(updateUserAddress));
// router.delete('/address/:addressId', asyncHandler(deleteUSerAddress));

//order Routes
router.post('/order', isAuthenticated, asyncHandler(createOrder));
router.get('/order/:userId', isAuthenticated, asyncHandler(fetchOrderByUserId));
router.get('/order/:id', isAuthenticated, asyncHandler(fetchOrderById));
router.patch('/order/:id/status', isAuthenticated, asyncHandler(updateOrderStatus));
//cart Routes
router.post('/cart', isAuthenticated, asyncHandler(createCart));
router.post('/cart/item', isAuthenticated, asyncHandler(addItemToCart));
router.get('/:cart_id/item', isAuthenticated, asyncHandler(fetchAllItemsInCart));
//flashSale Routes
router.post('/flashSale', isAuthenticated, asyncHandler(addFlashSaleProduct));
router.get('/flashSale', isAuthenticated, asyncHandler(getAllFlashSaleProduct));
router.get('/flashSale/:id', isAuthenticated, asyncHandler(fetchFlashSaleProductById));
//product Routes
router.post('/product', isAuthenticated, asyncHandler(addProduct));
router.get('/product/:id', isAuthenticated, asyncHandler(fetchProductById));
router.get('/product', isAuthenticated, asyncHandler(fetchAllProducts));
//category Routes
router.post('/category', isAuthenticated, asyncHandler(addCategoryName));
router.get('/category', isAuthenticated,asyncHandler(fetchAllCategory));
router.get('/category/:id', isAuthenticated, asyncHandler(fetchCategoryById));

export default router;
