import { crawlDomains, writeCSV } from "./crawler.service.js";
import dotenv from "dotenv";
import { crawlState } from "./crawler.service.js";

export function getCrawlStatus(req, res) {
  res.json(crawlState);
}

export async function runCrawler(req, res) {
  try {
    const { domains, maxPages } = req.body; // POST body: { domains: ["cnn.com", "twitch.tv"] }
dotenv.config();

// Read the environment variable
const domainsToCrawl = domains? domains : process.env.DOMAINS_TO_CRAWL ? JSON.parse(process.env.DOMAINS_TO_CRAWL) : [];
    const results = await crawlDomains(domainsToCrawl, maxPages);
    writeCSV(results); // optional
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
