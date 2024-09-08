import express from 'express';
import {STATUS_CODES} from '../constants.js';
import {
  Address,
  Cart,
  CartItem,
  Category,
  FlashSale,
  Order,
  OrderItem,
  Product,
  User
} from '../models/eCommerce.model.js';
import {apiError} from '../utils/apiError.util.js';
import {apiResponse} from '../utils/apiResponse.util.js';

const router = express.Router();

// User Routes
router.post('/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(STATUS_CODES.CREATED).json(user);
  } catch (err) {
    res.status(STATUS_CODES.BAD_REQUEST).json(new apiError(STATUS_CODES.BAD_REQUEST, 'Failed to add user', err, false));
  }
});

router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(STATUS_CODES.NOT_FOUND).json({message: 'User not found'});
    res.json(user);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

router.put('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!user) return res.status(STATUS_CODES.NOT_FOUND).json({message: 'User not found'});
    res.json(user);
  } catch (err) {
    res.status(STATUS_CODES.BAD_REQUEST).json({message: err.message});
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(STATUS_CODES.NOT_FOUND).json({message: 'User not found'});
    res.json({message: 'User deleted'});
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

router.post('/users/:id/address', async (req, res) => {
  try {
    const {address_line1, address_line2, city, state, zipcode, country} = req.body;
    if (!address_line1 || !city || !state || !zipcode || !country) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({message: 'Missing required fields'});
    }
    const address = new Address({
      user_id: req.params.id,
      address_line1,
      address_line2,
      city,
      state,
      zipcode,
      country
    });
    await address.save();
    res.status(STATUS_CODES.CREATED).json(address);
  } catch (err) {
    res.status(STATUS_CODES.BAD_REQUEST).json({message: err.message});
  }
});

router.get('/users/:id/address', async (req, res) => {
  try {
    const addresses = await Address.find({user_id: req.params.id});
    res.json(addresses);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

router.put('/address/:addressId', async (req, res) => {
  try {
    const address = await Address.findByIdAndUpdate(req.params.addressId, req.body, {new: true});
    if (!address) return res.status(STATUS_CODES.NOT_FOUND).json({message: 'Address not found'});
    res.json(address);
  } catch (err) {
    res.status(STATUS_CODES.BAD_REQUEST).json({message: err.message});
  }
});

router.delete('/address/:addressId', async (req, res) => {
  try {
    const address = await Address.findByIdAndDelete(req.params.addressId);
    if (!address) return res.status(STATUS_CODES.NOT_FOUND).json({message: 'Address not found'});
    res.json({message: 'Address deleted'});
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

// Order Routes
router.post('/create-order', async (req, res) => {
  try {
    const {user_id, total_amount, payment_method, items} = req.body;
    if (!user_id || !total_amount || !payment_method) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({message: 'Missing required fields: user_id, total_amount, and payment_method'});
    }
    const order = new Order({user_id, total_amount, payment_method});
    await order.save();
    const orderItems = items.map((item) => ({
      order_id: order._id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_purchase: item.price_at_purchase
    }));
    await OrderItem.insertMany(orderItems);
    res.status(STATUS_CODES.CREATED).json({order, orderItems});
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

router.get('/order/:userId', async (req, res) => {
  try {
    const orders = await Order.find({user_id: req.params.userId}).populate('user_id');
    res.json(orders);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

router.get('/order/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user_id');
    if (!order) return res.status(STATUS_CODES.NOT_FOUND).json({message: 'Order not found'});
    const orderItems = await OrderItem.find({order_id: order._id}).populate('product_id');
    res.json({order, orderItems});
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

router.patch('/order/:id/status', async (req, res) => {
  try {
    const {order_status} = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, {order_status}, {new: true});
    if (!order) return res.status(STATUS_CODES.NOT_FOUND).json({message: 'Order not found'});
    res.json(order);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

// Cart Routes
router.post('/create-cart', async (req, res) => {
  try {
    const cart = new Cart({user_id: req.body.user_id});
    await cart.save();
    res.status(STATUS_CODES.CREATED).json(cart);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

router.post('/add-item', async (req, res) => {
  try {
    const cartItem = new CartItem(req.body);
    await cartItem.save();
    res.status(STATUS_CODES.CREATED).json(cartItem);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

router.get('/:cart_id/items', async (req, res) => {
  try {
    const items = await CartItem.find({cart_id: req.params.cart_id});
    res.json(items);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});
// Create a new flash sale
router.post('/flashsales', async (req, res) => {
  try {
    const {product_id, discount_percentage, start_time, end_time} = req.body;

    // Validate required fields
    if (!product_id || !discount_percentage || !start_time || !end_time) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({message: 'Missing required fields: product_id, discount_percentage, start_time, and end_time'});
    }

    // Create a new flash sale instance
    const flashSale = new FlashSale({
      product_id,
      discount_percentage,
      start_time,
      end_time
    });

    // Save the flash sale to the database
    await flashSale.save();

    res.status(STATUS_CODES.CREATED).json(flashSale);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

router.get('/flashsales', async (req, res) => {
  try {
    const flashSales = await FlashSale.find().populate('product_id');
    res.json(flashSales);
  } catch (err) {
    res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json((STATUS_CODES.INTERNAL_SERVER_ERROR, 'flashsale not found ', err.message, false));
  }
});

router.get('/flashsales/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      res
        .status(STATUS_CODES.BAD_REQUEST)
        .json(new apiError(STATUS_CODES.INTERNAL_SERVER_ERROR, 'invalid flash sale ID'));
    }
    const flashSale = await FlashSale.findById(req.params.id).populate('product_id');
    if (!flashSale)
      return res.status(STATUS_CODES.NOT_FOUND).json(new apiError(STATUS_CODES.NOT_FOUND, 'Flash sale not found'));
    res.json(flashSale);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(STATUS_CODES.NOT_FOUND).json({message: 'Product not found'});
    res.json(product);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});
router.post('/categories', async (req, res) => {
  try {
    const {name, description} = req.body;
    if (!name) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({message: 'Category name is required'});
    }
    const category = new Category({name, description});
    await category.save();
    res.status(STATUS_CODES.CREATED).json(category);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

// Get all categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(STATUS_CODES.OK).json(categories);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

router.get('/categories/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(STATUS_CODES.NOT_FOUND).json({message: 'Category not found'});
    }
    res.status(STATUS_CODES.OK).json(category);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});
router.post('/products', async (req, res) => {
  try {
    const {category_id, name, description, price, stock_quantity, image_url, is_flash_sale} = req.body;

    if (!category_id || !name || !price) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({message: 'Missing required fields: category_id, name, and price'});
    }

    const product = new Product({
      category_id,
      name,
      description,
      price,
      stock_quantity,
      image_url,
      is_flash_sale
    });

    await product.save();

    res.status(STATUS_CODES.CREATED).json(product);
  } catch (err) {
    res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
  }
});

export default router;
