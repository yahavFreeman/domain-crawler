
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// Types
interface GlobalState {
  theme: "light" | "dark";
  error: string | null;
  isPopupVisible?: boolean;
}
const initialState: GlobalState = {
    theme: "light",
    error: null,
    isPopupVisible: false,
};
export const globalSlice = createSlice({
    name: "global",
    initialState,
    reducers: {
        setTheme: (state, action: PayloadAction<"light" | "dark">) => {
            state.theme = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            console.log("Global error set:", action.payload);
        },
        clearError: (state) => {
            state.error = null;
        },
        toggleErrorPopup: (state) => {
            state.isPopupVisible = !state.isPopupVisible;
        },
    },
});
export const { setTheme, setError, clearError, toggleErrorPopup } = globalSlice.actions;
export default globalSlice.reducer;