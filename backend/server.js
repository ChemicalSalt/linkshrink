import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import urlRoutes from "./routes/urlRoutes.js";
import UrlModel from "./models/Url.js";

dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

app.use("/api", urlRoutes);

app.get("/:shortcode", async (req, res) => {
  const { shortcode } = req.params;
  try {
    const record = await UrlModel.findOne({ short_code: shortcode });
    if (!record) return res.status(404).send("URL not found");
    record.visit_count = (record.visit_count || 0) + 1;
    await record.save();
    return res.redirect(record.original_url);
  } catch (error) {
    return res.status(500).send("Server error");
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch((err) => console.error("MongoDB error:", err));
