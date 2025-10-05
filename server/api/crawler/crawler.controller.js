import {crawlState, crawlDomains, resetCrawlState, deleteCsvFile, stopCrawlingState } from "./crawler.service.js";
import dotenv from "dotenv";

export function getCrawlStatus(req, res) {
  res.json(crawlState);
}

export function resetCrawlStatus(req, res) {
  resetCrawlState();
  deleteCsvFile(); 
  res.json({ success: true, state: crawlState });
}

export function stopCrawl(req, res) {
  if (crawlState.isCrawling) {
    stopCrawlingState();
    res.json({ success: true, message: "Crawl stopping..." });
  } else {
    res.json({ success: false, message: "No crawl in progress" });
  }
}

export async function runCrawler(req, res) {
  try {
    const { domains, maxPages } = req.body; // POST body: { domains: ["cnn.com", "twitch.tv"] }
dotenv.config();

// Read the environment variable
const domainsToCrawl = domains? domains : process.env.DOMAINS_TO_CRAWL ? JSON.parse(process.env.DOMAINS_TO_CRAWL) : [];
        setTimeout(() => {
    crawlDomains(domainsToCrawl, maxPages);
    }, 0);
    console.log("Crawl started for domains:");
    res.json({ success: true, message: "Crawl started" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
