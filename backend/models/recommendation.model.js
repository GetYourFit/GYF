import mongoose from "mongoose";

const genderSchema = new mongoose.Schema({
  age: Number,
  bbox: [Number],
  gender: String
}, { _id: false });

const itemSchema = new mongoose.Schema({
  bbox: [Number],
  class: String,
  confidence: Number,
  crop_base64: String
}, { _id: false });

const recommendationSchema = new mongoose.Schema({
  confidence_score: Number,
  gender: [genderSchema],
  image_url: String,
  items: {
    shoe: itemSchema
    // you can expand with more clothing types if needed
  },
  missing_categories: [String],
  product_url: String,
  set_id: String,
  title: String
}, { _id: false });

const recommendSchema = new mongoose.Schema({
  userPrompt: { type: String },
  budget: { type: Number },
  body_type: { type: String },
  detected_items: [String],
  processing_time_ms: Number,
  recommendations: [recommendationSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Recommendation", recommendSchema);
