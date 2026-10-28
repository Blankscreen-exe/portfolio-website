import { createSlice } from "@reduxjs/toolkit";
import { toggleTheme } from "../actions/colorThemeActions";

// A plain boolean: the store mounts this slice as `persistedReducer.isDarkMode`, so an
// object here (the old `{ isDarkMode: false }`) was always truthy and forced dark mode.
const initialValue = false

export const colorTheme = createSlice({
    name: "isDarkMode",
    initialState: initialValue,
    reducers: {
        // Register all action functions here, define them in ../actions/
        toggleThemeAction: toggleTheme
    }
});

export const { toggleThemeAction } = colorTheme.actions;
export default colorTheme.reducer;