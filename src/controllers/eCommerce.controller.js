import {STATUS_CODES} from '../constants.js';
import {Address,Cart,CartItem,Category,FlashSale,Order,OrderItem,Product} from '../models/eCommerce.model.js';
import {apiError} from '../utils/apiError.util.js';

export const createUserAddress =async (req, res) => {
    try {
      const {address_line1, address_line2, city, state, zipCode, country} = req.body;
      if (!address_line1 || !city || !state || !zipCode || !country) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({message: 'Missing required fields'});
      }
      const address = new Address({
        newUser_id: req.params.id,
        address_line1,
        address_line2,
        city,
        state,
        zipCode,
        country
      });
      await address.save();
      res.status(STATUS_CODES.CREATED).json(address);
    } catch (err) {
      res.status(STATUS_CODES.BAD_REQUEST).json({message: err.message});
    }
  }
 export const fetchAddressById = async (req, res) => {
    try {
      const response = await Address.find({user_id: req.params.id});
      res.json(response);
    } catch (err) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
    }
  }
  export const updateUserAddress =async (req, res) => {
    try {
      const response = await Address.findByIdAndUpdate(req.params.addressId, req.body, {new: true});
      if (!response) return res.status(STATUS_CODES.NOT_FOUND).json({message: 'Address not found'});
      res.json(response);
    } catch (err) {
      res.status(STATUS_CODES.BAD_REQUEST).json({message: err.message});
    }
  }
  export const deleteUSerAddress =async (req, res) => {
    try {
      const response = await Address.findByIdAndDelete(req.params.addressId);
      if (!response) return res.status(STATUS_CODES.NOT_FOUND).json({message: 'Address not found'});
      res.json({message: 'Address deleted'});
    } catch (err) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
    }
  }
  export const createOrder =async (req, res) => {
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
  }
  export const fetchOrderByUserId =async (req, res) => {
    try {
      const orders = await Order.find({user_id: req.params.userId}).populate('user_id');
      res.json(orders);
    } catch (err) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
    }
  }
  export const fetchOrderById =  async (req, res) => {
    try {
      const order = await Order.findById(req.params.id).populate('user_id');
      if (!order) return res.status(STATUS_CODES.NOT_FOUND).json({message: 'Order not found'});
      const orderItems = await OrderItem.find({order_id: order._id}).populate('product_id');
      res.json({order, orderItems});
    } catch (err) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
    }
  }
  export const updateOrderStatus =async (req, res) => {
    try {
      const {order_status} = req.body;
      const order = await Order.findByIdAndUpdate(req.params.id, {order_status}, {new: true});
      if (!order) return res.status(STATUS_CODES.NOT_FOUND).json({message: 'Order not found'});
      res.json(order);
    } catch (err) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
    }
  }
  export const createCart =async (req, res) => {
    try {
      const cart = new Cart({user_id: req.body.user_id});
      await cart.save();
      res.status(STATUS_CODES.CREATED).json(cart);
    } catch (err) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
    }
  }
  export const addItemToCart = async (req, res) => {
    try {
      const cartItem = new CartItem(req.body);
      await cartItem.save();
      res.status(STATUS_CODES.CREATED).json(cartItem);
    } catch (err) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
    }
  }
  export const fetchAllItemsInCart = async (req, res) => {
    try {
      const items = await CartItem.find({cart_id: req.params.cart_id});
      res.json(items);
    } catch (err) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
    }
  }
  export const addFlashSaleProduct =async (req, res) => {
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
  }
  export const getAllFlashSaleProduct = async (req, res) => {
    try {
      const flashSales = await FlashSale.find().populate('product_id');
      res.json(flashSales);
    } catch (err) {
      res
        .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
        .json((STATUS_CODES.INTERNAL_SERVER_ERROR, 'flashSale not found ', err.message, false));
    }
  }
  export const fetchFlashSaleProductById = async (req, res) => {
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
  }
  export const fetchAllProducts =async (req, res) => {
    try {
      const response = await Product.find();
      res.json(response);
    } catch (err) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
    }
  }
  export const fetchProductById= async (req, res) => {
    try {
      const response = await Product.findById(req.params.id);
      if (!response) return res.status(STATUS_CODES.NOT_FOUND).json({message: 'Product not found'});
      res.json(response);
    } catch (err) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
    }
  }
  export const addProduct= async (req, res) => {
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
  }
  export const addCategoryName= async (req, res) => {
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
  }
  export const fetchAllCategory= async (req, res) => {
    try {
      const categories = await Category.find();
      res.status(STATUS_CODES.OK).json(categories);
    } catch (err) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
    }
  }
  export const fetchCategoryById= async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(STATUS_CODES.NOT_FOUND).json({message: 'Category not found'});
      }
      res.status(STATUS_CODES.OK).json(category);
    } catch (err) {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({message: err.message});
    }
  }

