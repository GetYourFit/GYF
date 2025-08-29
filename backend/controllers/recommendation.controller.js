import fs from "fs";
import Recommendation from "../models/recommendation.model.js";
import { getFashionRecommendations } from "../services/ml.service.js"; // moved ML call to service for clarity

export const recommendFashion = async (req, res) => {
  try {
    const { budget, prompt } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Convert file → Base64
    const imageBuffer = fs.readFileSync(req.file.path);
    const base64Image = imageBuffer.toString("base64");
    fs.unlinkSync(req.file.path); // cleanup

    // Call ML model
    const mlResponse = await getFashionRecommendations(base64Image, budget, prompt);

    // Save to DB
    const recommendationDoc = new Recommendation({
      userPrompt: prompt,
      budget,
      body_type: mlResponse.body_type,
      detected_items: mlResponse.detected_items,
      processing_time_ms: mlResponse.processing_time_ms,
      recommendations: mlResponse.recommendations
    });

    await recommendationDoc.save();

    res.status(200).json({
      success: true,
      data: recommendationDoc
    });
  } catch (error) {
    console.error("Error in recommendFashion controller:", error.message);
    res.status(500).json({ error: "Failed to process recommendation" });
  }
};
