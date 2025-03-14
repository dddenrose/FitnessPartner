import { RootState } from "@/lib/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export const execriseSlice = createSlice({
  name: "execise",
  initialState: {
    mode: "execrise" as "execrise" | "finish",
    initialTime: [
      {
        name: "",
        time: 30,
        rest: 10,
      },
    ],
    time: [
      {
        name: "",
        time: 30,
        rest: 10,
      },
    ],
    pause: false,
  },
  reducers: {
    setMode: (state, action: PayloadAction<"execrise" | "finish">) => {
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
