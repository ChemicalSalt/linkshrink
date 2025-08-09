import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import urlRoutes from "./routes/urlRoutes.js";
import UrlModel from "./models/Url.js"; // Adjust path if needed

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Use API routes with /api prefix
app.use("/api", urlRoutes);

// Redirect route at root to handle short URLs
app.get("/:shortcode", async (req, res) => {
  const { shortcode } = req.params;
  try {
    const record = await UrlModel.findOne({ short_code: shortcode });
    if (record) {
      record.visit_count = (record.visit_count || 0) + 1;
      await record.save();
      return res.redirect(record.original_url);
    } else {
      return res.status(404).send("URL not found");
    }
  } catch (error) {
    return res.status(500).send("Server error");
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
