import express from "express"
import { recommendFashion } from "../controllers/recommendation.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/fashion", protect, recommendFashion);


export default router;