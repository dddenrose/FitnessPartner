import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

interface ExerciseState {
  mode: "prepare" | "exercise" | "rest" | "finished";
  times: {
    name: string;
    time: number;
    rest: number;
  }[];
  pause: boolean;
  initialTime: {
    name: string;
    time: number;
    rest: number;
  }[];
  navigationShow: boolean;
}

const initialState: ExerciseState = {
  mode: "prepare",
  times: [],
  pause: false,
  initialTime: [],
  navigationShow: true,
};

export const exerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {
    setMode: (state, action: PayloadAction<ExerciseState["mode"]>) => {
      state.mode = action.payload;
    },
    setTime: (
      state,
      action: PayloadAction<
        {
          name: string;
          time: number;
          rest: number;
        }[]
      >
    ) => {
      state.times = action.payload;
      state.initialTime = action.payload;
    },
    setPause: (state, action: PayloadAction<boolean>) => {
      state.pause = action.payload;
    },
    setNavigationShow: (state, action: PayloadAction<boolean>) => {
      state.navigationShow = action.payload;
    },
  },
});

export const { setMode, setTime, setPause, setNavigationShow } =
  exerciseSlice.actions;

// 選擇器
export const selectMode = (state: RootState) => state.exercise.mode;
export const selectTimes = (state: RootState) => state.exercise.times;
export const selectPause = (state: RootState) => state.exercise.pause;
export const selectNavigationShow = (state: RootState) =>
  state.exercise.navigationShow;

export default exerciseSlice.reducer;
