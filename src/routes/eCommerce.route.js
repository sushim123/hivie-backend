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
  updateOrderStatus,
  // updateUserAddress
} from '../controllers/eCommerce.controller.js';
import { asyncHandler } from '../utils/asyncHandler.util.js';

const router = express.Router();


// //address Routes
// router.post('/user/:id/address', asyncHandler(createUserAddress));
// router.get('/user/:id/address', asyncHandler(fetchAddressById));
// router.put('/address/:addressId', asyncHandler(updateUserAddress));
// router.delete('/address/:addressId', asyncHandler(deleteUSerAddress));

//order Routes
router.post('/order', asyncHandler(createOrder));
router.get('/order/:userId', asyncHandler(fetchOrderByUserId));
router.get('/order/:id', asyncHandler(fetchOrderById));
router.patch('/order/:id/status', asyncHandler(updateOrderStatus));
//cart Routes
router.post('/cart', asyncHandler(createCart));
router.post('/cart/item', asyncHandler(addItemToCart));
router.get('/:cart_id/item', asyncHandler(fetchAllItemsInCart));
//flashSale Routes
router.post('/flashSale', asyncHandler(addFlashSaleProduct));
router.get('/flashSale', asyncHandler(getAllFlashSaleProduct));
router.get('/flashSale/:id', asyncHandler(fetchFlashSaleProductById));
//product Routes
router.post('/product', asyncHandler(addProduct));
router.get('/product/:id', asyncHandler(fetchProductById));
router.get('/product', asyncHandler(fetchAllProducts));
//category Routes
router.post('/category', asyncHandler(addCategoryName));
router.get('/category', asyncHandler(fetchAllCategory));
router.get('/category/:id', asyncHandler(fetchCategoryById));
export default router;
