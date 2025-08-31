import fs from "fs";
import Recommendation from "../models/recommendation.model.js";
import { getFashionRecommendations } from "../services/ml.service.js"; 
// moved ML call to service for clarity
import { v2 as cloudinary } from "cloudinary";
import { nanoid } from "nanoid";

export const recommendFashion = async (req, res) => {
  try {
    const { budget, prompt } = req.body;

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    // Call ML model
    const mlResponse = await getFashionRecommendations(req.file, budget, prompt);

    // Process recommendations: upload each crop_base64 → Cloudinary
    const recommendationsWithUrls = await Promise.all(
      mlResponse.recommendations.map(async (rec) => {
        // Convert items object → array with Cloudinary URLs
        const itemsArray = await Promise.all(
          Object.entries(rec.items || {}).map(async ([key, value]) => {
            let imageUrl = null;
            if (value.crop_base64) {
              try {
                const uploadRes = await cloudinary.uploader.upload(
                  `data:image/jpeg;base64,${value.crop_base64}`,
                  { folder: "fashion_items" }
                );
                imageUrl = uploadRes.secure_url;
              } catch (err) {
                console.error("Cloudinary upload failed:", err.message);
              }
            }
    
            return {
              id: nanoid(),
              name: value.name || key,
              imageUrl,
              confidence: value.confidence,
              bbox: value.bbox,
            };
          })
        );
    
        return {
          ...rec,
          items: itemsArray,  // array instead of object
        };
      })
    );
    

    // Save to DB
    const recommendationDoc = new Recommendation({
      userId: req.user ? req.user._id : null,
      userPrompt: prompt,
      budget,
      body_type: mlResponse.body_type,
      detected_items: mlResponse.detected_items,
      processing_time_ms: mlResponse.processing_time_ms,
      recommendations: recommendationsWithUrls,
    });

    await recommendationDoc.save();

    console.log(recommendationDoc)

    res.status(200).json({
      success: true,
      data: recommendationDoc,
    });
  } catch (error) {
    console.error("Error in recommendFashion controller:", error.message);
    res.status(500).json({ error: "Failed to process recommendation" });
  }
};



export const getFashionRecommendationsByUser = async (req, res) => {
  try {
    const userId = req.user ? req.user._id : null;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const recommendations = await Recommendation.find({ userId }).sort({ createdAt: -1 });

    console.log("Fetched recommendations:", recommendations);

    res.status(200).json({
      success: true,
      data: recommendations
    });
  } catch (error) {
    console.error("Error fetching user recommendations:", error.message);
    res.status(500).json({ error: "Failed to fetch recommendations" });
  }
}