import express from "express";
const router = express.Router();
import {
  runCrawler,
  getCrawlStatus,
  resetCrawlStatus,
  stopCrawl,
} from "./crawler.controller.js";

router.post("/crawl", runCrawler);
router.post("/reset", resetCrawlStatus);
router.post("/stop", stopCrawl);
router.get("/status", getCrawlStatus);

export default router;
