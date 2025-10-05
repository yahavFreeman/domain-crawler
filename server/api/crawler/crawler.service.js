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

// a method to keep track of crawl state
export const crawlState = {
  isCrawling: false,
  isStopped: false,
  totalDomains: 0,
  totalPages: 0,
  currentDomain: null,
  pagesChecked: 0,
  completed: false,
  errors: [],
};

export function resetCrawlState() {
  crawlState.isCrawling = false;
  crawlState.isStopped = false;
  crawlState.totalDomains = 0;
  crawlState.totalPages = 0;
  crawlState.currentDomain = null;
  crawlState.pagesChecked = 0;
  crawlState.completed = false;
  crawlState.errors = [];
}

export function stopCrawlingState() {
  if (crawlState.isCrawling) {
    // Note: Puppeteer does not provide a direct way to stop ongoing navigation.
    // A more robust implementation would track browser/page instances to close them here.
    crawlState.isStopped = true;
    crawlState.errors.push("Crawl stopped by user.");
  }
}

// --- Helper: detect regex patterns and count them ---
function detectPatterns(content, patterns) {
  const evidence = [];

  for (const pattern of patterns) {
    const regex =
      typeof pattern === "string" ? new RegExp(pattern, "gi") : pattern;
    const matches = content.match(regex);

    if (matches && matches.length > 0) {
      evidence.push(regex.source);
    }
  }

  const totalCount = evidence.reduce((sum, e) => sum + 1, 0);

  return { totalCount, evidence };
}
// give path to CSV file consistent with env var or default
export function getCsvFilePath() {
  const filename = process.env.CSV_FILENAME || "crawler_results.csv";
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return path.join(__dirname, "../results/csv", filename);
}

export function writeCSV(results) {
  // do not write if stopped
  if (crawlState.isStopped) {
    return;
  }
  const fields = Object.keys(results[0]);

  const filePath = getCsvFilePath();

  const csv = parse(results, { fields });
  fs.writeFileSync(filePath, csv, "utf-8");
}

export function deleteCsvFile() {
  const filePath = getCsvFilePath();
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
// --- Main crawl function ---
export async function crawlDomains(domains, maxPages = 4) {
  resetCrawlState();
  deleteCsvFile(); // remove old results
  domains = Array.isArray(domains) ? domains : [domains]; // ensure array
  crawlState.isCrawling = true;
  crawlState.completed = false;
  crawlState.totalDomains = domains.length;
  crawlState.totalPages = domains.length * maxPages;
  const results = []; // array of domain results
  // Crawl each domain sequentially
  for (const domain of domains) {
    try {
      const res = await crawlSingleDomain(domain, maxPages);
      results.push(res);
      writeCSV(results);
    } catch (e) {
      crawlState.errors.push(`Domain ${domain} failed: ${e.message}`);
    }
  }
  crawlState.isCrawling = false;
  crawlState.completed = true;
  setTimeout(() => {
    resetCrawlState();
  }, 15000);
  return results;
}

// Determine executable path based on environment
const getExecutablePath = () => {
  if (process.env.NODE_ENV === 'production') {
    return '/usr/bin/google-chrome'; // Render's Chrome location
  }
  return puppeteer.executablePath();
};

async function crawlSingleDomain(domain, maxPages = 4) {
  if (crawlState.isStopped) {
    return;
  }
  // Initialize result object for this domain
  const result = {
    domain,
    pages_checked: 0,
    available_pages: 0,
    streaming_detected: false,
    streaming_evidence: [],
    google_ads_detected: false,
    google_ads_evidence: [],
    streaming_count: 0,
    ads_count: 0,
    errors: [],
  };
  crawlState.currentDomain = domain;
  crawlState.isCrawling = true;
  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: getExecutablePath(),
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--single-process",
      "--no-zygote",
    ],
  });
  const page = await browser.newPage();

  try {
    // 3. Start at homepage
    const startUrl = "https://" + domain;
    await page.goto(startUrl, { waitUntil: "networkidle2", timeout: 20000 });
    page.setDefaultNavigationTimeout(20000);

    // Collect internal links
    const links = await page.$$eval("a[href]", (anchors) =>
      anchors.map((a) => a.href).filter((href) => href.startsWith("http"))
    );
    const internalLinks = links.filter((l) => l.includes(domain));

    result.available_pages = internalLinks.length;
    // Collect pages to crawl. Always include homepage first
    const pagesToVisit = [startUrl, ...internalLinks.slice(0, maxPages - 1)];
    if (pagesToVisit.length < maxPages) {
      crawlState.totalPages -= maxPages - pagesToVisit.length; // adjust total if fewer pages
    }

    await page.close();

    for (const url of pagesToVisit) {
      try {
        const page = await browser.newPage();
        // 2. Network requests detection
        const reqs = [];
        page.on("request", (req) => reqs.push(req.url()));

        await page.goto(url, { waitUntil: "networkidle2", timeout: 20000 });
        page.setDefaultNavigationTimeout(20000);

        const html = await page.content();

        // 1. DOM detection
        const htmlStreaming = detectPatterns(html, STREAMING_PATTERNS);
        const htmlAds = detectPatterns(html, ADS_PATTERNS);
        // network requests detection
        const netContent = reqs.join("\n");
        const netStreaming = detectPatterns(netContent, STREAMING_PATTERNS);
        const netAds = detectPatterns(netContent, ADS_PATTERNS);

        // Merge count from both detectors
        const pageStreamingCount =
          htmlStreaming.totalCount + netStreaming.totalCount;
        const pageAdsCount = htmlAds.totalCount + netAds.totalCount;

        if (pageStreamingCount) {
          result.streaming_detected = true;
          result.streaming_evidence.push(
            ...htmlStreaming.evidence,
            ...netStreaming.evidence
          );
        }
        if (pageAdsCount) {
          result.google_ads_detected = true;
          result.google_ads_evidence.push(
            ...htmlAds.evidence,
            ...netAds.evidence
          );
        }
        result.streaming_count =
          (result.streaming_count || 0) + pageStreamingCount;
        result.ads_count = (result.ads_count || 0) + pageAdsCount;
        result.pages_checked += 1;
        crawlState.pagesChecked += 1;
        await page.close();
      } catch (e) {
        result.errors.push(`Error visiting ${url}: ${e.message}`);
      }
    }
  } catch (e) {
    result.errors.push(`Domain failed: ${e.message}`);
  } finally {
    await browser.close();
    return result;
  }
}
