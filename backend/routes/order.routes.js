import express from "express"
import { createOrder, getOrderById, updateOrderToPaid, getUserOrders, getCartItems, addToCart, getCart, updateCartItem, removeCartItem, clearCart, updateCartStatus, getRecentOrders } from "../controllers/order.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post("/create", protect, createOrder);
router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, updateOrderToPaid);
router.get("/myorders", protect, getUserOrders);
router.get("/cart/items", protect, getCartItems);
router.post("/cart/add",protect, addToCart);
router.get("/cart/:userId", getCart);
router.patch("/cart/:userId/item/:itemId", updateCartItem);
router.delete("/cart/:userId/item/:itemId", removeCartItem);
router.delete("/cart/clear/:userId",clearCart);
router.post("/cart/checkout/:userId",protect, updateCartStatus);
router.get("/cart/recent/:userId",protect,getRecentOrders);
export default router;
