import { RootState } from "@/lib/store";
import { createSlice } from "@reduxjs/toolkit";

export const execriseSlice = createSlice({
  name: "execise",
  initialState: {
    mode: "prepare",
    initialTime: {
      main: 5,
      rest: 0,
      rounds: 8,
    },
    time: {
      main: 0,
      rest: 0,
      rounds: 0,
    },
    pause: false,
  },
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    setTime: (state, action) => {
      state.time = action.payload;
    },
    setPause: (state, action) => {
      state.pause = action.payload;
    },
  },
});

export const { setMode, setTime, setPause } = execriseSlice.actions;

export const selectMode = (state: RootState) => state.execrise.mode;
export const selectTime = (state: RootState) => state.execrise.time;

export default execriseSlice.reducer;
