import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

// 定義不同的運動模式類型
export type WorkoutModeType =
  | "standard" // 標準健身模式，有固定的運動和休息時間
  | "slowrun" // 超慢跑模式
  | "hiit" // 高強度間歇訓練
  | "custom"; // 自定義模式

export interface WorkoutItem {
  id: string; // 每個運動項目的唯一 ID
  name: string; // 運動名稱
  time: number; // 運動時間 (秒)
  rest: number; // 休息時間 (秒)
  sets?: number; // 組數（適用於某些模式）
  intensity?: number; // 強度等級 (1-10)
}

export interface ExerciseState {
  // 當前運動狀態
  status: "idle" | "prepare" | "active" | "paused" | "finished";

  // 運動模式設定
  workoutType: WorkoutModeType;

  // 超慢跑模式相關設定
  bpm: number; // 步頻 (每分鐘步數)
  metronomeActive: boolean; // 節拍器是否啟用

  // 當前運動項目
  currentExercise: WorkoutItem | null;

  // 剩餘運動項目
  remainingExercises: WorkoutItem[];

  // 已完成的運動項目
  completedExercises: WorkoutItem[];

  // 初始運動計劃（用於重置或參考）
  initialWorkoutPlan: WorkoutItem[];

  // 會話信息
  sessionInfo: {
    startTime: string | null; // ISO 日期時間
    totalDuration: number; // 總時長（秒）
    pausedTime: number; // 暫停時間（秒）
    lastActive: string | null; // 上次活動時間
  };

  // UI 控制
  navigationShow: boolean;

  // 錯誤訊息
  error: string | null;

  // 向下兼容的字段
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
}

const initialState: ExerciseState = {
  // 新結構
  status: "idle",
  workoutType: "standard",
  bpm: 180,
  metronomeActive: true,
  currentExercise: null,
  remainingExercises: [],
  completedExercises: [],
  initialWorkoutPlan: [],
  sessionInfo: {
    startTime: null,
    totalDuration: 0,
    pausedTime: 0,
    lastActive: null,
  },
  navigationShow: true,
  error: null,

  // 向下兼容的字段
  mode: "prepare",
  times: [],
  pause: false,
  initialTime: [],
};

export const exerciseSlice = createSlice({
  name: "exercise",
  initialState,
  reducers: {
    // 新的 action creators
    // 設置運動模式
    setWorkoutType: (state, action: PayloadAction<WorkoutModeType>) => {
      state.workoutType = action.payload;
    },

    // 設置超慢跑模式的 BPM (步頻)
    setBpm: (state, action: PayloadAction<number>) => {
      state.bpm = action.payload;
    },

    // 切換節拍器是否啟用
    toggleMetronome: (state, action: PayloadAction<boolean | undefined>) => {
      if (action.payload !== undefined) {
        state.metronomeActive = action.payload;
      } else {
        state.metronomeActive = !state.metronomeActive;
      }
    },

    // 設置運動狀態
    setStatus: (state, action: PayloadAction<ExerciseState["status"]>) => {
      const now = new Date().toISOString();

      // 如果從暫停狀態變為活動狀態，更新暫停時間
      if (state.status === "paused" && action.payload === "active") {
        if (state.sessionInfo.lastActive) {
          const pauseDuration =
            new Date().getTime() -
            new Date(state.sessionInfo.lastActive).getTime();
          state.sessionInfo.pausedTime += pauseDuration / 1000;
        }
      }

      // 如果是開始運動
      if (state.status === "idle" && action.payload === "active") {
        state.sessionInfo.startTime = now;
      }

      state.sessionInfo.lastActive = now;
      state.status = action.payload;

      // 向下兼容
      if (action.payload === "active") {
        state.mode = "exercise";
        state.pause = false;
      } else if (action.payload === "paused") {
        state.pause = true;
      } else if (action.payload === "finished") {
        state.mode = "finished";
      }
    },

    // 設置完整的運動計劃
    setWorkoutPlan: (state, action: PayloadAction<WorkoutItem[]>) => {
      const workoutItems = action.payload;

      if (workoutItems.length === 0) {
        state.error = "運動計劃不能為空";
        return;
      }

      state.initialWorkoutPlan = [...workoutItems];
      state.remainingExercises = [...workoutItems.slice(1)];
      state.completedExercises = [];
      state.currentExercise = { ...workoutItems[0] };
      state.status = "prepare";
      state.error = null;

      // 重置會話信息
      state.sessionInfo = {
        startTime: null,
        totalDuration: 0,
        pausedTime: 0,
        lastActive: null,
      };

      // 向下兼容
      state.times = workoutItems.map((item) => ({
        name: item.name,
        time: item.time,
        rest: item.rest,
      }));
      state.initialTime = [...state.times];
      state.mode = "prepare";
    },

    // 更新當前運動的剩餘時間
    updateCurrentExerciseTime: (state, action: PayloadAction<number>) => {
      if (state.currentExercise) {
        state.currentExercise.time = action.payload;

        // 向下兼容
        if (state.times.length > 0) {
          state.times[0].time = action.payload;
        }
      }
    },

    // 更新當前休息的剩餘時間
    updateCurrentRestTime: (state, action: PayloadAction<number>) => {
      if (state.currentExercise) {
        state.currentExercise.rest = action.payload;

        // 向下兼容
        if (state.times.length > 0) {
          state.times[0].rest = action.payload;
        }
      }
    },

    // 移至下一個運動
    moveToNextExercise: (state) => {
      // 將當前運動添加到已完成列表
      if (state.currentExercise) {
        state.completedExercises.push({
          ...state.currentExercise,
          time: 0,
          rest: 0,
        });
      }

      // 如果還有剩餘運動
      if (state.remainingExercises.length > 0) {
        state.currentExercise = state.remainingExercises[0];
        state.remainingExercises = state.remainingExercises.slice(1);

        // 向下兼容
        state.times = [
          {
            name: state.currentExercise.name,
            time: state.currentExercise.time,
            rest: state.currentExercise.rest,
          },
          ...state.remainingExercises.map((item) => ({
            name: item.name,
            time: item.time,
            rest: item.rest,
          })),
        ];
      } else {
        // 運動結束
        state.currentExercise = null;
        state.status = "finished";
        state.mode = "finished"; // 向下兼容

        // 計算總運動時間
        if (state.sessionInfo.startTime) {
          const endTime = new Date().getTime();
          const startTime = new Date(state.sessionInfo.startTime).getTime();
          state.sessionInfo.totalDuration =
            (endTime - startTime) / 1000 - state.sessionInfo.pausedTime;
        }

        // 向下兼容
        state.times = [];
      }
    },

    // 跳過當前運動
    skipCurrentExercise: (state) => {
      if (state.remainingExercises.length > 0) {
        state.currentExercise = state.remainingExercises[0];
        state.remainingExercises = state.remainingExercises.slice(1);

        // 向下兼容
        state.times = [
          {
            name: state.currentExercise.name,
            time: state.currentExercise.time,
            rest: state.currentExercise.rest,
          },
          ...state.remainingExercises.map((item) => ({
            name: item.name,
            time: item.time,
            rest: item.rest,
          })),
        ];
      } else {
        state.currentExercise = null;
        state.status = "finished";
        state.mode = "finished"; // 向下兼容
        state.times = []; // 向下兼容
      }
    },

    // 重置運動計劃到初始狀態
    resetWorkout: (state) => {
      if (state.initialWorkoutPlan.length > 0) {
        state.currentExercise = { ...state.initialWorkoutPlan[0] };
        state.remainingExercises = [...state.initialWorkoutPlan.slice(1)];
        state.completedExercises = [];
        state.status = "prepare";

        // 重置會話信息
        state.sessionInfo = {
          startTime: null,
          totalDuration: 0,
          pausedTime: 0,
          lastActive: null,
        };

        // 向下兼容
        state.times = state.initialWorkoutPlan.map((item) => ({
          name: item.name,
          time: item.time,
          rest: item.rest,
        }));
        state.mode = "prepare";
        state.pause = false;
      }
    },

    // 設置錯誤
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },

    // 清除錯誤
    clearError: (state) => {
      state.error = null;
    },

    // 向下兼容的 action creators
    setMode: (state, action: PayloadAction<ExerciseState["mode"]>) => {
      state.mode = action.payload;

      // 同步到新結構
      if (action.payload === "prepare") {
        state.status = "prepare";
      } else if (action.payload === "exercise") {
        state.status = state.pause ? "paused" : "active";
      } else if (action.payload === "rest") {
        state.status = state.pause ? "paused" : "active";
      } else if (action.payload === "finished") {
        state.status = "finished";
      }
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
      state.initialTime = [...action.payload];

      // 同步到新結構
      if (action.payload.length > 0) {
        const workoutItems = action.payload.map((item, index) => ({
          id: `workout-${index}`,
          name: item.name,
          time: item.time,
          rest: item.rest,
        }));

        state.initialWorkoutPlan = [...workoutItems];
        state.currentExercise = workoutItems[0];
        state.remainingExercises = workoutItems.slice(1);
        state.completedExercises = [];
      } else {
        state.initialWorkoutPlan = [];
        state.currentExercise = null;
        state.remainingExercises = [];
        state.completedExercises = [];
      }
    },

    setPause: (state, action: PayloadAction<boolean>) => {
      state.pause = action.payload;

      // 同步到新結構
      if (action.payload) {
        state.status = "paused";
      } else if (state.status === "paused") {
        state.status = "active";
      }
    },

    setNavigationShow: (state, action: PayloadAction<boolean>) => {
      state.navigationShow = action.payload;
    },
  },
});

export const {
  // 新的 action creators
  setWorkoutType,
  setBpm,
  toggleMetronome,
  setStatus,
  setWorkoutPlan,
  updateCurrentExerciseTime,
  updateCurrentRestTime,
  moveToNextExercise,
  skipCurrentExercise,
  resetWorkout,
  setError,
  clearError,

  // 向下兼容的 action creators
  setMode,
  setTime,
  setPause,
  setNavigationShow,
} = exerciseSlice.actions;

// 新的選擇器
export const selectStatus = (state: RootState) => state.exercise.status;
export const selectWorkoutType = (state: RootState) =>
  state.exercise.workoutType;
export const selectBpm = (state: RootState) => state.exercise.bpm;
export const selectMetronomeActive = (state: RootState) =>
  state.exercise.metronomeActive;
export const selectCurrentExercise = (state: RootState) =>
  state.exercise.currentExercise;
export const selectRemainingExercises = (state: RootState) =>
  state.exercise.remainingExercises;
export const selectCompletedExercises = (state: RootState) =>
  state.exercise.completedExercises;
export const selectInitialWorkoutPlan = (state: RootState) =>
  state.exercise.initialWorkoutPlan;
export const selectSessionInfo = (state: RootState) =>
  state.exercise.sessionInfo;
export const selectError = (state: RootState) => state.exercise.error;

// 計算選擇器
export const selectTotalExercises = (state: RootState) =>
  (state.exercise.currentExercise ? 1 : 0) +
  state.exercise.completedExercises.length +
  state.exercise.remainingExercises.length;

export const selectCompletionPercentage = (state: RootState) => {
  const total = selectTotalExercises(state);
  if (total === 0) return 0;
  return (state.exercise.completedExercises.length / total) * 100;
};

export const selectIsActive = (state: RootState) =>
  state.exercise.status === "active";
export const selectIsPaused = (state: RootState) =>
  state.exercise.status === "paused";
export const selectIsFinished = (state: RootState) =>
  state.exercise.status === "finished";

// 向下兼容的選擇器
export const selectMode = (state: RootState) => state.exercise.mode;
export const selectTimes = (state: RootState) => state.exercise.times;
export const selectPause = (state: RootState) => state.exercise.pause;

export default exerciseSlice.reducer;
