import express from "express"
import { createOrder, getOrderById, updateOrderToPaid, getUserOrders, getCartItems } from "../controllers/order.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
const router = express.Router();
router.post("/", protect, createOrder);
router.get("/:id", protect, getOrderById);
router.put("/:id/pay", protect, updateOrderToPaid);
router.get("/myorders", protect, getUserOrders);
router.get("/cart/items", protect, getCartItems);

export default router;
