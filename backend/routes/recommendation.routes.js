import express from "express"
import { getFashionRecommendationsByUser, recommendFashion } from "../controllers/recommendation.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();
router.post("/fashion", protect, upload.single('pic'), recommendFashion);
router.get("/all", protect, getFashionRecommendationsByUser);



export default router;