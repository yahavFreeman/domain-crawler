import express from "express";
import crawlerRoutes from "./api/crawler/crawler.routes.js";
import resultsRoutes from "./api/results/results.routes.js";
import { crawlDomains, crawlState, writeCSV } from "./api/crawler/crawler.service.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: [
    "http://127.0.0.1:5173",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://localhost:3000",
    "http://localhost",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/crawler", crawlerRoutes);
app.use("/api/v1/results", resultsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
    // Start crawl in background on server start as requested
  const domains = process.env.DOMAINS_TO_CRAWL ? JSON.parse(process.env.DOMAINS_TO_CRAWL) : [];
  crawlDomains(domains, 4);
});

export default app;