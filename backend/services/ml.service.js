import axios from "axios";
import fs from "fs";
import FormData from "form-data";   // ✅ need this in Node

export const getFashionRecommendations = async (imageFile, budget, prompt) => {
  try {
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imageFile.path)); // ✅ stream for file
    formData.append("budget", budget);
    formData.append("prompt", prompt);

    // Let axios handle headers properly
    const { data } = await axios.post(
      "http://127.0.0.1:5000/recommend",
      formData,
      {
        headers: {
          ...formData.getHeaders(), // ✅ important!
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Error contacting ML model:", error.message);
    throw new Error("ML model request failed");
  }
};
