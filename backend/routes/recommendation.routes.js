import express from "express"
import { recommendFashion } from "../controllers/recommendation.controller.js";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/multer.js";

const router = express.Router();
router.post("/fashion", protect, upload.single('pic'), recommendFashion);


export default router;