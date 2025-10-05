import express from "express";
import { getCrawlResults } from "./results.controller.js";
const router = express.Router();

router.get("/", getCrawlResults);

export default router;
