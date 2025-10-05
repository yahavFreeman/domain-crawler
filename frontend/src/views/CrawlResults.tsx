import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  crawlDomains,
  fetchCrawlProgress,
  fetchCrawlResults,
  stopCrawling,
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

const getCrawlProgress = useCallback(async () => {
  try {
    await dispatch(fetchCrawlProgress());
  } catch (error) {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    dispatch(setError(error instanceof Error ? error.message : String(error)));
  }
}, [dispatch]);

const getCrawlResults = useCallback(async () => {
  try {
    await dispatch(fetchCrawlResults());
  } catch (error) {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    dispatch(setError(error instanceof Error ? error.message : String(error)));
  }
}, [dispatch]);

const stopCrawl = useCallback(async () => {
  try {
    await dispatch(stopCrawling());
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : String(error)));
  }
}, [dispatch]);

const startNewCrawl = useCallback(async () => {
  try {
    await dispatch(crawlDomains({}));
    await getCrawlProgress();
  } catch (error) {
    dispatch(setError(error instanceof Error ? error.message : String(error)));
  }
}, [dispatch, getCrawlProgress]);


  // fetch once on mount
  useEffect(() => {
    getCrawlResults();
    getCrawlProgress();
  }, [getCrawlResults, getCrawlProgress]);

  // polling logic
  useEffect(() => {
    if (crawlProgress?.isCrawling) {
      if (!intervalRef.current) {
        intervalRef.current = setInterval(() => {// poll results and progress every 5s
          getCrawlProgress();
          getCrawlResults();
        }, 5000);
      }
    } else {
      if (intervalRef.current) { // clear if not crawling
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
      return () => { // cleanup on unmount
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  }, [crawlProgress?.isCrawling, getCrawlProgress, getCrawlResults]);

  // Determine status message
  const getStatusMessage = () => {
    if (crawlProgress?.isCrawling && crawlProgress?.isStopped) {
      return `Crawl Is Stopping After Crawling ${crawlProgress?.currentDomain}...`;
    }
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
        <h1 className={"text-lg text-center font-semibold mb-4"}>
          {getStatusMessage()}
        </h1>
        {/* Progress bar only when crawling */}
        {crawlProgress.isCrawling ? (
          <>
            <CrawlProgressBar
              pagesChecked={crawlProgress.pagesChecked}
              totalPages={crawlProgress.totalPages}
            />
            <div className="text-center items-center mt-2 space-y-1">
              <p>
                <span className="font-medium">Pages Checked:</span>{" "}
                {crawlProgress.pagesChecked} / {crawlProgress.totalPages}
              </p>
              {!crawlProgress.isStopped &&
              <button
                className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition"
                onClick={() => {
                  stopCrawl();
                }}
              >
                Stop Crawl
              </button>
              }
            </div>
          </>
        ) : (
          <div className="text-center items-center mt-2 space-y-1">
            <button
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer transition"
              onClick={() => {
                if (intervalRef.current) {
                  clearInterval(intervalRef.current);
                  intervalRef.current = null;
                }
                startNewCrawl();
              }}
            >
              Start A New Crawl
            </button>
          </div>
        )}
        {!results.length ? (
          <div className=" text-center items-center mt-2">No Domain Results Yet</div>
        ) : (
          <div className="mt-2 flex flex-col xl:flex-row gap-6">
            <CrawlDataGraph data={results.slice(0, 20)} />
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
