import axios from "axios";

export const getFashionRecommendations = async (base64Image, budget, prompt) => {
  try {
    const { data } = await axios.post("http://localhost:5000/recommend", {
      image: base64Image,
      budget,
      prompt
    });

    return data;
  } catch (error) {
    console.error("Error contacting ML model:", error.message);
    throw new Error("ML model request failed");
  }
};
