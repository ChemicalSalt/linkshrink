import express from "express";
import UrlModel from "../models/Url.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Generate random code
function generateCode(length = 6) {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({ length }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

// Ensure code is unique
async function generateUniqueCode(length = 6) {
  let code, exists = true;
  while (exists) {
    code = generateCode(length);
    exists = await UrlModel.exists({ short_code: code });
  }
  return code;
}

// POST - Create short URL
router.post("/shorten", async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl) return res.status(400).json({ error: "Long URL required" });

  try {
    new global.URL(longUrl); // Validate URL
  } catch {
    return res.status(400).json({ error: "Invalid URL format" });
  }

  const code = await generateUniqueCode();
  const shortUrl = `${process.env.BASE_URL}/${code}`;

  const newUrl = new UrlModel({
    original_url: longUrl,
    short_code: code,
  });

  await newUrl.save();
  res.json({ shortUrl, short_code: code, original_url: longUrl });
});

// JWT Middleware to protect admin routes
function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.split(" ")[1]; // Expect Bearer <token>

  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.user = decoded;
    next();
  });
}

// Admin login route
router.post("/admin/login", (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ token });
  } else {
    return res.status(401).json({ error: "Invalid credentials" });
  }
});

// Protected admin URLs list route
router.get("/admin/urls", verifyToken, async (req, res) => {
  try {
    const allUrls = await UrlModel.find().sort({ created_at: -1 }); // latest first
    res.json(allUrls);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching URLs" });
  }
});

export default router;
