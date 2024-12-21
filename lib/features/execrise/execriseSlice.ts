import { RootState } from "@/lib/store";
import { createSlice } from "@reduxjs/toolkit";

export const execriseSlice = createSlice({
  name: "execise",
  initialState: {
    mode: "prepare",
  },
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
  },
});

export const { setMode } = execriseSlice.actions;

export const selectMode = (state: RootState) => state.execrise.mode;

export default execriseSlice.reducer;
