import { readCSV } from "./results.service.js";
export function getCrawlResults(req, res) {
  try {
    const results = readCSV();
    res.json(results);
  } catch (err) {
    console.error("Failed to read crawl results:", err.message);
    res.status(500).json({ error: "Failed to load results" });
  }
}

