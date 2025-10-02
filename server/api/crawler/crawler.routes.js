import express from "express";
const router = express.Router();
import { runCrawler, getCrawlStatus, resetCrawlStatus } from "./crawler.controller.js";

router.post("/crawl", runCrawler);
router.post("/reset", resetCrawlStatus);
router.get("/status", getCrawlStatus);

export default router;
