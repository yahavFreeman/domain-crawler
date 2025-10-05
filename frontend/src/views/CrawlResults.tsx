import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCrawlProgress,
  fetchCrawlResults,
} from "../store/crawl/crawlSlice";
import type { AppDispatch, RootState } from "../store/store";
import { CrawlProgressBar } from "../components/crawl/CrawlProgressBar";
import { CrawlDataTable } from "../components/results/CrawlDataTable";
import { CrawlDataGraph } from "../components/results/CrawlDataChart";
import { setError } from "../store/global/globalSlice";

export const CrawlResults = () => {
  const results = useSelector((state: RootState) => state.crawl.results);
  const crawlProgress = useSelector((state: RootState) => state.crawl.progress);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const getCrawlProgress = async () => {
    try {
      await dispatch(fetchCrawlProgress());
    } catch (error) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  const getCrawlResults = async () => {
    try {
      await dispatch(fetchCrawlResults());
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    }
  };

  // fetch once on mount
  useEffect(() => {
    getCrawlResults();
    getCrawlProgress();
  }, []);

  // polling logic
  useEffect(() => {
    if (crawlProgress?.isCrawling) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {
          getCrawlProgress();
          getCrawlResults();
        }, 5000);
      }
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [crawlProgress?.isCrawling, crawlProgress?.completed]);

  const getStatusMessage = () => {
    if (crawlProgress?.isCrawling) {
      return `Crawling ${crawlProgress?.currentDomain || "Domains"}...`;
    }
    if (crawlProgress?.completed) {
      return `Crawl Completed: ${results.length} Domain${
        results.length > 1 ? "s" : ""
      } processed.`;
    }
    return "Idle — No Active Crawl.";
  };

  return (
    <div className="pt-4">
      <div className="bg-white px-2">
        {/* Unified status text */}
        <h1 className={"text-lg text-center font-semibold mb-4"}>{getStatusMessage()}</h1>
        {/* Progress bar only when crawling */}
        {crawlProgress.isCrawling && (
          <>
            <CrawlProgressBar
              pagesChecked={crawlProgress.pagesChecked}
              totalPages={crawlProgress.totalPages}
            />
            <div className="text-center">
              <p>
                <span className="font-medium">Pages Checked:</span>{" "}
                {crawlProgress.pagesChecked} / {crawlProgress.totalPages}
              </p>
            </div>
          </>
        )}
        {!results.length ? (
          <div className="items-center mt-2">No Domain Results Yet</div>
        ) : (
          <div className="mt-2 flex flex-col xl:flex-row gap-6">
            <CrawlDataGraph data={results} />
            <CrawlDataTable
              data={results}
              title={`Crawled Domains ${
                crawlProgress.isCrawling ? "(Partial)" : ""
              }`}
            />
          </div>
        )}
      </div>
    </div>
  );
};
