import { configureStore } from "@reduxjs/toolkit";
import crawlReducer from "./crawl/crawlSlice";
import globalReducer from "./global/globalSlice";

export const store = configureStore({
  reducer: {
    crawl: crawlReducer,
    global: globalReducer,
  },
});

// Type helpers
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
