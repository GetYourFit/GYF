// controllers/order.controller.js
import asyncHandler from "express-async-handler";
import { Order } from "../models/order.model.js";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = asyncHandler(async (req, res) => {
  const { items, paymentMethod, totalAmount } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No order items");
  }

  const order = new Order({
    user: req.user._id,
    items,
    totalAmount,
    paymentMethod,
    orderStatus: "In-Cart", // default
    paymentStatus: "paid"   // default
  });

  const createdOrder = await order.save();
  res.status(201).json(createdOrder);
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "firstName lastName email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.paymentStatus = "paid";
  order.orderStatus = "processing"; // still in processing after payment
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    update_time: req.body.update_time,
    email_address: req.body.payer?.email_address,
  };

  const updatedOrder = await order.save();
  res.json(updatedOrder);
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get cart items (In-Cart orders only)
// @route   GET /api/orders/cart
// @access  Private
export const getCartItems = asyncHandler(async (req, res) => {
  const cartOrders = await Order.find({ user: req.user._id, orderStatus: "In-Cart" });

  if (!cartOrders || cartOrders.length === 0) {
    res.status(404);
    throw new Error("No cart items found");

  }
  console.log(cartOrders)

  res.json(cartOrders);
});
export const addToCart = async (req, res) => {
    try {
      
      const { item } = req.body; // item = { image, description, price, quantity }
      console.log(item)
  
      let cart = await Order.findOne({ user: req.user._id, orderStatus: "In-Cart" });
      console.log(cart)

if (!cart) {
  cart = new Order({
    user: req.user._id,
    items: [item],
    totalAmount: item.price * item.quantity,
    orderStatus: "In-Cart",
  });
} else {
  // identify uniqueness by name + size + color
  const existingItem = cart.items.find(
    (i) =>
      i.name === item.name &&
      i.selectedSize === item.selectedSize &&
      i.selectedColor === item.selectedColor
  );

  if (existingItem) {
    existingItem.quantity += item.quantity;
  } else {
    cart.items.push(item);
  }

  cart.totalAmount = cart.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );
}

  
      await cart.save();
      console.log(cart)
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // 2. Get Cart
  export const getCart = async (req, res) => {
    try {
      const { userId } = req.params;
      const cart = await Order.findOne({ user: userId, orderStatus: "In-Cart" });
      res.status(200).json(cart || { items: [] });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // 3. Update Item Quantity
  export const updateCartItem = async (req, res) => {
    try {
      const { userId, itemId } = req.params;
      const { quantity } = req.body;
  
      const cart = await Order.findOne({ user: userId, orderStatus: "In-Cart" });
      if (!cart) return res.status(404).json({ msg: "Cart not found" });
  
      const item = cart.items.id(itemId);
      if (!item) return res.status(404).json({ msg: "Item not found" });
  
      item.quantity = quantity;
  
      cart.totalAmount = cart.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
  
      await cart.save();
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  // 4. Remove Item
  export const removeCartItem = async (req, res) => {
    try {
      const { userId, itemId } = req.params;

      console.log(userId, itemId)
  
      const cart = await Order.findOne({ user: userId, orderStatus: "In-Cart" });
      console.log(cart)
      if (!cart) return res.status(404).json({ msg: "Cart not found" });
  
      cart.items = cart.items.filter((i) => i.id.toString() !== itemId);
  
      cart.totalAmount = cart.items.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0
      );
  
      await cart.save();
      res.status(200).json(cart);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


  export const clearCart = asyncHandler(async (req, res) => {
    const {userId} = req.params;
    try {
      const cart = await Order.findOne({ user:userId , orderStatus: "In-Cart" });
      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      cart.items = [];
      cart.totalAmount = 0;
      await cart.save();
  
      res.status(200).json({ message: "Cart cleared successfully", cart });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

export const updateCartStatus = asyncHandler(async (req, res) => {
  const { orderStatus } = req.body;

  const {userId} = req.params;

  try {
    const cart = await Order.findOne({ user: userId, orderStatus: "In-Cart" });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.orderStatus = orderStatus;
    await cart.save();

    res.status(200).json({ message: "Cart status updated", cart });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
}
);


export const getRecentOrders = asyncHandler(async (req, res) => {
  // console.log(req.user._id)
  const {userId} = req.params;
  try {
    const recentOrders = await Order.find({
      user: userId,
      orderStatus: { $ne: "In-Cart" },
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .lean(); // return plain JSON for faster analysis
      // const orders = [ /* your data here */ ];

      const itemCounts = {};
      
      // Iterate through all orders
      recentOrders.forEach(order => {
        order.items.forEach(item => {
          if (itemCounts[item.name]) {
            itemCounts[item.name] += item.quantity;
          } else {
            itemCounts[item.name] = item.quantity;
          }
        });
      });
      
      console.log(itemCounts);
      
    res.status(200).json(itemCounts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
