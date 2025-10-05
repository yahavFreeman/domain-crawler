import { getCsvFilePath } from "../crawler/crawler.service.js";
import fs from "fs";
import { parse } from "csv-parse/sync";

// Read and parse the CSV file
export function readCSV() {
  const filePath = getCsvFilePath();
  if (!fs.existsSync(filePath)) {
    return []; // no results yet
  }
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const results = parse(fileContent, { columns: true });
  return results.map(normalizeResult);
}

function normalizeResult(raw) {
  return {
    domain: raw.domain,
    pages_checked: Number(raw.pages_checked),
    available_pages: Number(raw.available_pages),
    streaming_detected: raw.streaming_detected === "true",
    streaming_evidence: JSON.parse(raw.streaming_evidence),
    google_ads_detected: raw.google_ads_detected === "true",
    google_ads_evidence: JSON.parse(raw.google_ads_evidence),
    streaming_count: Number(raw.streaming_count),
    ads_count: Number(raw.ads_count),
    errors: JSON.parse(raw.errors),
  };
}

