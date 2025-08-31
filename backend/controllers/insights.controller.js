
import {Insight} from "../models/insight.model.js";
import asyncHandler from "express-async-handler";


// @desc    Get user insights
// @route   GET /api/insights
// @access  Private
export const getInsights = asyncHandler(async (req, res) => {
  const insights = await Insight.findOne({ user: req.user._id });

  if (!insights) {
    return res.status(404).json({ message: "No insights found for this user." });
  }

  res.json(insights);
});