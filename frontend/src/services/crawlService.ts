import { httpService } from "./http.service.ts";

export async function getCrawlResults(): Promise<any> {
  return await httpService.get("/results");
}

export async function getCrawlStatus(): Promise<any> {
  return await httpService.get("/crawler/status");
}

export async function startCrawl(
  domains?: string[],
  maxPages?: number
): Promise<any> {
  return await httpService.post("/crawler/crawl", { domains, maxPages });
}

export async function stopCrawl(): Promise<any> {
  return await httpService.post("/crawler/stop");
}
