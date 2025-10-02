import express from "express";
const router = express.Router();
import { runCrawler, getCrawlStatus } from "./crawler.controller.js";

router.post("/crawl", runCrawler);
router.get("/status", getCrawlStatus);

export default router;
