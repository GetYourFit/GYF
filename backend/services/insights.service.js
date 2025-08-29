import googleGenAi  from "../utils/Gemini.js"; // your pre-prepared fn
import { Insight } from "../models/insight.model.js";   // create insights collection

export const storeInsights = async (user) => {
  // 🔹 Prepare context for AI
  const prompt = `
  Generate personalized fashion insights for:
  Name: ${user.firstName} ${user.lastName}
  Gender: ${user.Gender}
  Age: ${user.DOB ? new Date().getFullYear() - new Date(user.DOB).getFullYear() : "N/A"}
  Budget: ${user.monthlyBudget || "Not provided"}

  Focus:
  - Practical fashion tips for their demographic
  - Seasonal style recommendations
  - Why using GetYourFit (GYF) will make fashion choices easier
  `;

  // 🔹 Call Gemini / Google Generative AI
  const insightsText = await googleGenAi(prompt);

  // 🔹 Save to DB
  const insightDoc = new Insight({
    user: user._id,
    insights: insightsText,
  });

  await insightDoc.save();

  return insightDoc;
};
