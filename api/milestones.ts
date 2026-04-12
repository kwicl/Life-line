import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

async function getSheet() {
  if (!SPREADSHEET_ID || !SERVICE_ACCOUNT_EMAIL || !PRIVATE_KEY) {
    return null;
  }
  const auth = new JWT({
    email: SERVICE_ACCOUNT_EMAIL,
    key: PRIVATE_KEY,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth);
  await doc.loadInfo();
  return doc.sheetsByIndex[0];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    try {
      const sheet = await getSheet();
      if (!sheet) return res.json([]);
      const rows = await sheet.getRows();
      const milestones = rows.map((row) => ({
        id: row.get("id"),
        year: parseInt(row.get("year")),
        date: row.get("date"),
        title: row.get("title"),
        type: row.get("type"),
        value: parseFloat(row.get("value")) || 0,
        circumstances: row.get("circumstances"),
        imageUrl: row.get("imageUrl"),
        color: row.get("color"),
        lineWidth: parseInt(row.get("lineWidth")) || 3,
      }));
      return res.json(milestones);
    } catch (error) {
      console.error("GET /api/milestones error:", error);
      return res.status(500).json({ error: "Failed to fetch milestones" });
    }
  }

  if (req.method === "POST") {
    try {
      const sheet = await getSheet();
      if (!sheet) {
        return res.status(400).json({ error: "Google Sheets not configured" });
      }
      const m = req.body;
      await sheet.addRow({
        id: Date.now().toString(),
        year: m.year?.toString() || new Date(m.date).getFullYear().toString(),
        date: m.date,
        title: m.title,
        type: m.type,
        value: m.value?.toString() || "0",
        circumstances: m.circumstances,
        imageUrl: m.imageUrl || "",
        color: m.color,
        lineWidth: m.lineWidth?.toString() || "3",
      });
      return res.status(201).json({ message: "Milestone added successfully" });
    } catch (error) {
      console.error("POST /api/milestones error:", error);
      return res.status(500).json({ error: "Failed to add milestone" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
