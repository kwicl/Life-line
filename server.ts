import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import dotenv from "dotenv";
import multer from "multer";
import fs from "fs";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Google Sheets Setup
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

async function getSheet() {
  if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
    return null;
  }

  try {
    const serviceAccountAuth = new JWT({
      email: SERVICE_ACCOUNT_EMAIL,
      key: PRIVATE_KEY,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const doc = new GoogleSpreadsheet(SPREADSHEET_ID, serviceAccountAuth);
    await doc.loadInfo();
    return doc.sheetsByIndex[0];
  } catch (error) {
    console.error("Google Sheets Auth Error:", error);
    return null;
  }
}

// API Routes
app.get("/api/config", (req, res) => {
  res.json({
    hasConfig: !!(SPREADSHEET_ID && SERVICE_ACCOUNT_EMAIL && PRIVATE_KEY),
    spreadsheetId: SPREADSHEET_ID || "",
  });
});

app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

app.get("/api/milestones", async (req, res) => {
  try {
    const sheet = await getSheet();
    if (!sheet) {
      // Return empty if not configured instead of failing
      return res.json([]);
    }

    const rows = await sheet.getRows();
    const milestones = rows.map((row) => ({
      id: row.get("id"),
      year: parseInt(row.get("year")),
      date: row.get("date"),
      title: row.get("title"),
      type: row.get("type"),
      value: parseFloat(row.get("value")),
      circumstances: row.get("circumstances"),
      imageUrl: row.get("imageUrl"),
      color: row.get("color"),
      lineWidth: parseInt(row.get("lineWidth")),
    }));

    res.json(milestones);
  } catch (error) {
    console.error("Error fetching milestones:", error);
    res.status(500).json({ error: "Failed to fetch milestones" });
  }
});

app.post("/api/milestones", async (req, res) => {
  try {
    const sheet = await getSheet();
    if (!sheet) {
      return res.status(400).json({ error: "Google Sheets not configured. Please check your .env file." });
    }

    const newMilestone = req.body;
    await sheet.addRow({
      id: Date.now().toString(),
      year: newMilestone.year.toString(),
      date: newMilestone.date,
      title: newMilestone.title,
      type: newMilestone.type,
      value: newMilestone.value.toString(),
      circumstances: newMilestone.circumstances,
      imageUrl: newMilestone.imageUrl,
      color: newMilestone.color,
      lineWidth: newMilestone.lineWidth.toString(),
    });

    res.status(201).json({ message: "Milestone added successfully" });
  } catch (error) {
    console.error("Error adding milestone:", error);
    res.status(500).json({ error: "Failed to add milestone" });
  }
});

// Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

