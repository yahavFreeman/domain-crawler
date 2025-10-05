import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  getCrawlResults,
  getCrawlStatus,
  startCrawl,
  stopCrawl,
} from "../../services/crawlService.ts";
import { setError } from "../global/globalSlice.tsx";
// Types
interface CrawlProgress {
  isCrawling: boolean;
  isStopped: boolean;
  totalDomains: number;
  totalPages: number;
  currentDomain: string | null;
  pagesChecked: number;
  domainsCompleted: Array<string>;
  errors: Array<string>;
  completed: boolean;
}

export interface CrawlResult {
  domain: string;
  pages_checked: number;
  available_pages: number;
  streaming_detected: boolean;
  streaming_evidence: string[];
  google_ads_detected: boolean;
  google_ads_evidence: string[];
  streaming_count: number;
  ads_count: number;
  errors: string[];
}

interface CrawlState {
  results: CrawlResult[];
  progress: CrawlProgress;
  isLoading: boolean;
  error: string | null;
}

// Async thunks
export const fetchCrawlResults = createAsyncThunk<
  CrawlResult[],
  void,
  { rejectValue: string }
>(
  "crawl/fetchResults",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const res = await getCrawlResults();
      return res;
    } catch (error: any) {
      // Log and set global error
      console.error("Error fetching crawl results:", error);
      dispatch(setError(error.message || "Failed to fetch crawl results"));
      return rejectWithValue(error.message);
    }
  }
);


export const fetchCrawlProgress = createAsyncThunk<
  CrawlProgress,
  void,
  { rejectValue: string }
>("crawl/fetchCrawlProgress", async (_, { rejectWithValue, dispatch }) => {
  try {
    const res = await getCrawlStatus();
    return res;
  } catch (error: any) {
    // Set global error here
    dispatch(setError(error.message));
    return rejectWithValue(error.message);
  }
});


export const crawlDomains = createAsyncThunk<
  void,
  { domains?: string[]; maxPages?: number },
  { rejectValue: string }
>(
  "crawl/crawlDomains",
  async ({ domains, maxPages }, { rejectWithValue, dispatch }) => {
    try {
      const res = await startCrawl(domains, maxPages);
      return res;
    } catch (error: any) {
      // Set a global error
      dispatch(setError(error.message || "Failed to start crawl"));
      return rejectWithValue(error.message);
    }
  }
);

export const stopCrawling = createAsyncThunk<void, void, { rejectValue: string }>(
  "crawl/stopCrawling",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      await stopCrawl();
    } catch (error: any) {
      dispatch(setError(error.message || "Failed to stop crawl"));
      return rejectWithValue(error.message);
    }
  }
);




const initialState: CrawlState = {
  results: [],
  progress: {
    isCrawling: false,
    totalDomains: 0,
    totalPages: 0,
    currentDomain: null,
    pagesChecked: 0,
    domainsCompleted: [],
    errors: [],
    completed: false,
    isStopped: false
  },
  isLoading: false,
  error: null,
};

const crawlSlice = createSlice({
  name: "crawl",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCrawlResults.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        fetchCrawlResults.fulfilled,
        (state, action: PayloadAction<CrawlResult[]>) => {
          console.log("Fetched crawl results:", action.payload);
          state.results = action.payload.sort((a, b) => {
            return (
              b.streaming_count +
              b.ads_count -
              (a.streaming_count + a.ads_count)
            );
          });
          state.isLoading = false;
        }
      )
      .addCase(fetchCrawlResults.rejected, (state, action) => {
        state.error = action.error.message ?? "Unknown error";
        state.isLoading = false;
      })
      .addCase(fetchCrawlProgress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCrawlProgress.rejected, (state, action) => {
        state.error = action.error.message ?? "Unknown error";
        state.progress.isCrawling = false;
        state.isLoading = false;
      })
      .addCase(
        fetchCrawlProgress.fulfilled,
        (state, action: PayloadAction<CrawlProgress>) => {
          state.progress = action.payload;
          state.isLoading = false;
        }
      )
      
      .addCase(crawlDomains.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(crawlDomains.rejected, (state, action) => {
        state.error = action.error.message ?? "Unknown error";
        state.isLoading = false;
        state.progress.isCrawling = false;
      })
      .addCase(crawlDomains.fulfilled, (state) => {
        state.isLoading = false;
        state.progress.isCrawling = true;
      })
  },
});

export default crawlSlice.reducer;
