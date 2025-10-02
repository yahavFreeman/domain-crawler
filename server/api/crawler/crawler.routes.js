const express = require("express");
const router = express.Router();
const { runCrawler } = require("../controllers/crawlerController");

router.post("/crawl", runCrawler);

module.exports = router;
