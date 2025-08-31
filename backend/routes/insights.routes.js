import express from "express"
import { getInsights } from "../controllers/insights.controller.js"
import { protect } from "../middlewares/authMiddleware.js"
const router = express.Router();
router.get("/", protect, getInsights);
export default router;
