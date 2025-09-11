export type ExerciseMode = "prepare" | "exercise" | "rest" | "finished";

export interface ExerciseTiming {
  name: string;
  time: number;
  rest: number;
}

export interface ExerciseState {
  mode: ExerciseMode;
  times: ExerciseTiming[];
}
