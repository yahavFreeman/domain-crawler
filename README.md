# 🕷️ Web Crawler for Streaming & Ads Detection

A lightweight, Puppeteer-based web crawler designed to scan domains for **streaming** and **advertising** patterns.  
It analyzes a configurable set of websites, detects relevant URLs and scripts, and exports structured metrics for further analysis.

---

## 🚀 Features

### 🕸️ Domain Crawling
- Crawls a configurable list of domains (from `.env` or API input).  
- Supports limiting the number of pages per domain.  
- Automatically tracks progress with a live progress bar.  
- Can pause, resume, or stop the crawl at any time.

### 🎥 Streaming Detection
Detects common **streaming-related patterns**, including:
- File extensions: `.m3u8`, `.mpd`
- APIs and scripts: `MediaSource`, `HLS`, `DASH`
- HTML elements: `<video>` and related media tags

### 💰 Ads Detection
Identifies **Google Ads and related ad network patterns**, such as:
- `googlesyndication`
- `doubleclick.net`
- `pagead2`
- `pubads`
- and more

### 📊 Metrics & Reporting
Collects and aggregates detailed crawl data:
- Pages scanned and successfully processed  
- Evidence of streaming or ads per domain  
- Error tracking and domain-level summaries  

Exports results to a structured **CSV file** for easy analysis and sharing.

### 📈 Visualization
- Displays an interactive **progress bar** showing crawl completion in real time.  
- Provides a **summary graph** categorizing findings by type.  
- Includes a **Top 20 domains table** ranked by number of detections.

### 🧩 Limitations & Known False Positives

Detection logic:
This crawler identifies streaming and advertisement content by scanning for known patterns in URLs, script sources, and HTML tags — such as .m3u8, .mpd, MediaSource, doubleclick.net, googlesyndication, and similar keywords.

# Known false positives:

Streaming indicators like .m3u8, .mpd, or MediaSource may appear in unrelated scripts (e.g., analytics, polyfills, or background assets).

Ad-related domains such as doubleclick.net or googlesyndication can be embedded in analytics or tracking scripts even when no actual ads are displayed.

Blocked or cached ad scripts may still appear in the HTML or network responses, triggering detection despite not being active.

# Known false negatives:

Obfuscated or dynamically generated ad/video sources may evade detection.

If a site loads content after heavy user interaction (e.g., scroll or click), it may not be captured within the crawler’s observation window.

---

## ⚙️ Installation

# Backend

1. Navigate to the server directory and copy the example file to create your local environment file:
```bash
cd server
cp .env.example .env
```
2. Download node packages
```bash
npm install
```
3. Run the backend
```bash
npm run start
```
# this will start a crawling procedure in the domains stated in the .env file.

# Frontend
1. Navigate to the frontend directory 
```bash
cd frontend
```
2. download node packages
```bash
npm install
```
2. Run the frontend
```bash
npm run dev
```

## Run the app
# Open your browser and navigate to: [http://localhost:5173](http://localhost:5173)


