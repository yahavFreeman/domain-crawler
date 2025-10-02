# domain-crawler

A Node.js crawler that analyzes websites to detect **streaming content** and **Google Ads** usage.  
It uses **Puppeteer** (headless Chromium) to crawl domains, inspect their pages, and generate structured results in **CSV** format.

---

## Features
- Crawl any given domain (configurable number of pages).
- Detect common **streaming patterns**:
  - `.m3u8`, `.mpd`, `MediaSource`, `<video>` tags, etc.
- Detect **Google Ads patterns**:
  - `googlesyndication`, `doubleclick.net`, `pagead2`, `pubads`, etc.
- Collect metrics:
  - Pages available & checked
  - Streaming evidence
  - Ads evidence
  - Errors count
- Export results to a **CSV file** (`/results/csv/crawler_results.csv`).
- API-ready structure (Express routes, controllers, services).

---

## 📂 Project Structure
