import { crawlDomain, writeCSV } from "./crawler.service.js";

async function runCrawler(req, res) {
  try {
    const { domains, maxPages } = req.body; // POST body: { domains: ["cnn.com", "twitch.tv"] }
    const results = await crawlDomain(domains, maxPages);
    writeCSV(results); // optional
    res.json({ success: true, results });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { runCrawler };
