import { RootState } from "../../../store";

// 基本選擇器
export const selectExerciseState = (state: RootState) => state.exercise;

// 衍生選擇器
export const selectMode = (state: RootState) => selectExerciseState(state).mode;
export const selectTimes = (state: RootState) =>
  selectExerciseState(state).times;
