import puppeteer from "puppeteer";
import fs from "fs";
import { parse } from "json2csv";
import path from "path";
import { fileURLToPath } from "url";
// --- Detection patterns ---
const STREAMING_PATTERNS = [
  /\.m3u8/i,
  /\.mpd/i,
  /WebSocket/i,
  /EventSource/i,
  /hls\.js/i,
  /MediaSource/i,
  /<video\b/i,
  /youtube\.com\/watch|vimeo\.com/i,
];

const ADS_PATTERNS = [
  /googlesyndication/i,
  /adsbygoogle/i,
  /doubleclick\.net/i,
  /pagead2\.googlesyndication\.com/i,
  /google_ad_client/i,
  /googletagmanager/i,
  /pubads/i,
];

// --- Helper: detect regex patterns ---
function detectPatterns(content, patterns) {
  const evidence = [];
  for (const regexPatern of patterns) {
    if (regexPatern.test(content)) evidence.push(regexPatern.source);
  }
  return { found: evidence.length > 0, evidence };
}

function writeCSV(results, filename = "crawler_results.csv") {
  const fields = Object.keys(results[0]);
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  const filePath = path.join(__dirname, "../results/csv", filename);

  const csv = parse(results, { fields });
  fs.writeFileSync(filePath, csv, "utf-8");
  console.log(`✅ CSV saved as ${filePath}`);
}

// --- Crawl one domain ---
async function crawlDomain(domain, maxPages = 4) {
  const result = {
    domain,
    pages_checked: 0,
    available_pages: 0,
    streaming_detected: false,
    streaming_evidence: [],
    google_ads_detected: false,
    google_ads_evidence: [],
    errors: [],
  };

  const visited = new Set();

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    const startUrl = "https://" + domain;
    await page.goto(startUrl, { waitUntil: "networkidle2", timeout: 60000 });
    page.setDefaultNavigationTimeout(60000);

    // Collect internal links
    const links = await page.$$eval("a[href]", (anchors) =>
      anchors.map((a) => a.href).filter((href) => href.startsWith("http"))
    );
    const internalLinks = links.filter((l) => l.includes(domain));

    result.available_pages = internalLinks.length;
    // Always include homepage first
    const pagesToVisit = [startUrl, ...internalLinks.slice(0, maxPages - 1)];

    await page.close();

    for (const url of pagesToVisit) {
      if (visited.has(url)) continue;
      visited.add(url);
      const page = await browser.newPage();
      try {
        await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
        page.setDefaultNavigationTimeout(60000);
        result.pages_checked++;

        //for streaming heavy sites
        await new Promise((resolve) => setTimeout(resolve, 5000));

        const html = await page.content();
        // 1. DOM detection
        const htmlStreaming = detectPatterns(html, STREAMING_PATTERNS);
        const htmlAds = detectPatterns(html, ADS_PATTERNS);
        // 2. Network requests detection
        const reqs = [];
        page.on("request", (req) => reqs.push(req.url()));

        const netContent = reqs.join("\n");
        const netStreaming = detectPatterns(netContent, STREAMING_PATTERNS);
        const netAds = detectPatterns(netContent, ADS_PATTERNS);

        // Merge evidences per page uniquely
        const pageStreamingEvidence = [
          ...new Set([...htmlStreaming.evidence, ...netStreaming.evidence]),
        ];
        const pageAdsEvidence = [
          ...new Set([...htmlAds.evidence, ...netAds.evidence]),
        ];

        if (pageStreamingEvidence.length) {
          result.streaming_detected = true;
          result.streaming_evidence.push(...pageStreamingEvidence);
        }
        if (pageAdsEvidence.length) {
          result.google_ads_detected = true;
          result.google_ads_evidence.push(...pageAdsEvidence);
        }
      } catch (e) {
        result.errors.push(`Error visiting ${url}: ${e.message}`);
      }
    }
  } catch (e) {
    result.errors.push(`Domain failed: ${e.message}`);
  } finally {
    await browser.close();
  }

  // Deduplicate evidence
  result.streaming_evidence = [...new Set(result.streaming_evidence)];
  result.google_ads_evidence = [...new Set(result.google_ads_evidence)];

  return result;
}
module.exports = {
  crawlDomain,
  writeCSV
};
