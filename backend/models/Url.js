import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_code: { type: String, required: true, unique: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  visit_count: { type: Number, default: 0 },
});

urlSchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

export default mongoose.model("URL", urlSchema);
