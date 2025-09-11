import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExerciseMode, ExerciseTiming, ExerciseState } from "../types";

const initialState: ExerciseState = {
  mode: "prepare",
  times: [],
};

export const exerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<ExerciseMode>) => {
      state.mode = action.payload;
    },
    setTime: (state, action: PayloadAction<ExerciseTiming[]>) => {
      state.times = action.payload;
    },
  },
});

export const { setMode, setTime } = exerciseSlice.actions;

export default exerciseSlice.reducer;
