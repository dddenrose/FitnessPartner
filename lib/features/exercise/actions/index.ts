import { ExerciseMode, ExerciseTiming } from "../types";

// Action types
export const SET_MODE = "exercise/setMode";
export const SET_TIME = "exercise/setTime";

// Action creators
export const setMode = (mode: ExerciseMode) => ({
  type: SET_MODE,
  payload: mode,
});

export const setTime = (times: ExerciseTiming[]) => ({
  type: SET_TIME,
  payload: times,
});

// Action types for reducer
export type SetModeAction = ReturnType<typeof setMode>;
export type SetTimeAction = ReturnType<typeof setTime>;

export type ExerciseActions = SetModeAction | SetTimeAction;
