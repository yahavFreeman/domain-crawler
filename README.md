# domain-crawler

A Node.js crawler that analyzes websites to detect **streaming content** and **Google Ads** usage.  
It uses **Puppeteer** (headless Chromium) to crawl domains, inspect their pages, and generate structured results in **CSV** format.

---

## Features
- Crawl a set of given domains (configurable number of pages).
- Detect common **streaming patterns**:
  - `.m3u8`, `.mpd`, `MediaSource`, `<video>` tags, etc.
- Detect **Google Ads patterns**:
  - `googlesyndication`, `doubleclick.net`, `pagead2`, `pubads`, etc.
- Collect metrics:
  - Pages available & checked
  - Streaming evidence
  - Ads evidence
  - Errors count
- Export results to a local **CSV file**.
- API-ready structure (Express routes, controllers, services).

---

## Backend

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

## Frontend
1. Navigate to the frontend directory and download node packages
```bash
npm install
```
2. Run the frontend
```bash
npm run dev
```
3. Open your browser and navigate to: 3. Open your browser and navigate to: [http://localhost:5173](http://localhost:5173)




