import mongoose from "mongoose";

const insightSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  insights: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Insight = mongoose.model("Insight", insightSchema);
