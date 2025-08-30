import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config({});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function googleGenAi(prompt) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0,
    },
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
  });

  let text = response.candidates?.[0]?.content?.parts?.[0]?.text || "";
  let cleanText = text.trim();

  // Strip common markdown wrappers
  cleanText = cleanText.replace(/^```json\s*/i, "")
                       .replace(/^```\s*/i, "")
                       .replace(/```$/i, "");

  try {
    // Try parsing as JSON
    const parsed = JSON.parse(cleanText);

    // If it's an object, stringify it neatly before saving
    return typeof parsed === "string" ? parsed : JSON.stringify(parsed, null, 2);
  } catch {
    // Fallback: return plain text, not object
    return cleanText;
  }
}

export default googleGenAi;
