import express from "express";
import crawlerRoutes from "./api/crawler/crawler.routes.js";
import resultsRoutes from "./api/results/results.routes.js";
import { crawlDomains, crawlState, writeCSV } from "./api/crawler/crawler.service.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { getCrawlResults } from "./api/results/results.controller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/v1/crawler", crawlerRoutes);
app.use("/api/v1/results", resultsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
    // Start crawl in background on server start
  const domains = process.env.DOMAINS_TO_CRAWL_INI ? JSON.parse(process.env.DOMAINS_TO_CRAWL_INI) : [];
  crawlDomains(domains, 4).then(results => {
    console.log("Initial Background Crawl Finished!");
    writeCSV(results);
  }).catch(console.error);
});

export default app;