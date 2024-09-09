import mongoose from 'mongoose';
const {Schema} = mongoose;

// User Schema
// const userSchema = new Schema({
//   name: {type: String},
//   created_at: {type: Date, default: Date.now},
//   updated_at: {type: Date, default: Date.now}
// });
// const User = mongoose.model('EUser', userSchema);

// Address Schema
const addressSchema = new Schema({
  user_id: {type: Schema.Types.ObjectId, ref: 'EUser', required: true},
  address_line1: {type: String, required: true},
  address_line2: {type: String},
  city: {type: String, required: true},
  state: {type: String, required: true},
  zipCode: {type: String, required: true},
  country: {type: String, required: true},
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});
const Address = mongoose.model('Address', addressSchema);

// Category Schema
const categorySchema = new Schema({
  name: {type: String, unique: true, required: true},
  description: {type: String},
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});
const Category = mongoose.model('Category', categorySchema);

// Product Schema
const productSchema = new Schema({
  category_id: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
  name: {type: String, required: true},
  description: {type: String},
  price: {type: Number, required: true},
  stock_quantity: {type: Number, default: 0},
  image_url: {type: String},
  is_flash_sale: {type: Boolean, default: false},
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});
const Product = mongoose.model('Product', productSchema);

// Flash Sale Schema
const flashSaleSchema = new Schema({
  product_id: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
  discount_percentage: {type: Number, required: true},
  start_time: {type: Date, required: true},
  end_time: {type: Date, required: true},
  created_at: {type: Date, default: Date.now}
});
const FlashSale = mongoose.model('FlashSale', flashSaleSchema);

// Order Schema
const orderSchema = new Schema({
  user_id: {type: Schema.Types.ObjectId, ref: 'EUser', required: true},
  total_amount: {type: Number, required: true},
  payment_method: {type: String, required: true},
  order_status: {
    type: String,
    required: true,
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending'
  },
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});
const Order = mongoose.model('Order', orderSchema);

// Order Item Schema
const orderItemSchema = new Schema({
  order_id: {type: Schema.Types.ObjectId, ref: 'Order', required: true},
  product_id: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
  quantity: {type: Number, required: true},
  price_at_purchase: {type: Number, required: true},
  created_at: {type: Date, default: Date.now}
});
const OrderItem = mongoose.model('OrderItem', orderItemSchema);

// Cart Schema
const cartSchema = new Schema({
  user_id: {type: Schema.Types.ObjectId, ref: 'EUser', required: true},
  created_at: {type: Date, default: Date.now},
  updated_at: {type: Date, default: Date.now}
});
const Cart = mongoose.model('Cart', cartSchema);

// Cart Item Schema
const cartItemSchema = new Schema({
  cart_id: {type: Schema.Types.ObjectId, ref: 'Cart', required: true},
  product_id: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
  quantity: {type: Number, required: true},
  price_at_addition: {type: Number, required: true},
  created_at: {type: Date, default: Date.now}
});
const CartItem = mongoose.model('CartItem', cartItemSchema);

// Export all models
export {Address, Cart, CartItem, Category, FlashSale, Order, OrderItem, Product};
