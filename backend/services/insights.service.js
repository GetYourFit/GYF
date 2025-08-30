import googleGenAi from "../utils/Gemini.js"; // your pre-prepared fn
import { Insight } from "../models/insight.model.js";

export const storeInsights = async (user) => {
  // 🔹 Prepare context for AI
  const prompt = `
  Generate personalized fashion insights in JSON format only.

  User:
  - Name: ${user.firstName} ${user.lastName}
  - Gender: ${user.Gender}
  - Age: ${user.DOB ? new Date().getFullYear() - new Date(user.DOB).getFullYear() : "N/A"}

  Required JSON structure:
  {
    "practicalTips": ["tip1", "tip2", "tip3"],
    "seasonalRecommendations": ["rec1", "rec2", "rec3"],
    "whyGYF": ["point1", "point2", "point3"]
  }

  Ensure it is **valid JSON** with no extra text.
  `;

  // 🔹 Call Gemini / Google Generative AI
  const insightsJson = await googleGenAi(prompt);

  let parsedInsights;
  try {
    parsedInsights = JSON.parse(insightsJson);
  } catch (err) {
    throw new Error("Failed to parse Gemini response as JSON: " + err.message);
  }

  // 🔹 Save to DB
  const insightDoc = new Insight({
    user: user._id,
    insights: parsedInsights,
  });

  await insightDoc.save();

  return insightDoc;
};
