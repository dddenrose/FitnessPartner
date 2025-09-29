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

  // 錯誤訊息
  error: string | null;
}

const initialState: ExerciseState = {
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
  error: null,
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
    },

    // 開始超慢跑模式
    startSlowRun: (state) => {
      // 清除任何現有的運動計劃，因為超慢跑不需要
      state.initialWorkoutPlan = [];
      state.remainingExercises = [];
      state.completedExercises = [];
      state.currentExercise = null;
      state.status = "active";
      state.workoutType = "slowrun";
      state.error = null;

      // 重置會話信息並設置開始時間
      const now = new Date().toISOString();
      state.sessionInfo = {
        startTime: now,
        totalDuration: 0,
        pausedTime: 0,
        lastActive: now,
      };
    },

    // 設置完整的運動計劃 (HIIT模式)
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
      state.workoutType = "hiit";
      state.error = null;

      // 重置會話信息
      state.sessionInfo = {
        startTime: null,
        totalDuration: 0,
        pausedTime: 0,
        lastActive: null,
      };
    },

    // 更新當前運動的剩餘時間
    updateCurrentExerciseTime: (state, action: PayloadAction<number>) => {
      if (state.currentExercise) {
        state.currentExercise.time = action.payload;
      }
    },

    // 更新當前休息的剩餘時間
    updateCurrentRestTime: (state, action: PayloadAction<number>) => {
      if (state.currentExercise) {
        state.currentExercise.rest = action.payload;
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
      } else {
        // 運動結束
        state.currentExercise = null;
        state.status = "finished";

        // 計算總運動時間
        if (state.sessionInfo.startTime) {
          const endTime = new Date().getTime();
          const startTime = new Date(state.sessionInfo.startTime).getTime();
          state.sessionInfo.totalDuration =
            (endTime - startTime) / 1000 - state.sessionInfo.pausedTime;
        }
      }
    },

    // 跳過當前運動
    skipCurrentExercise: (state) => {
      if (state.remainingExercises.length > 0) {
        state.currentExercise = state.remainingExercises[0];
        state.remainingExercises = state.remainingExercises.slice(1);
      } else {
        state.currentExercise = null;
        state.status = "finished";
      }
    },

    // 完成運動並記錄運動數據
    completeWorkout: (state) => {
      // 如果是運行中的狀態，計算總時間
      if (state.status === "active" || state.status === "paused") {
        // 計算總運動時間
        if (state.sessionInfo.startTime) {
          const endTime = new Date().getTime();
          const startTime = new Date(state.sessionInfo.startTime).getTime();
          state.sessionInfo.totalDuration =
            (endTime - startTime) / 1000 - state.sessionInfo.pausedTime;
        }
      }

      // 確保超慢跑模式也能正確記錄，添加一個虛擬完成的運動項目
      if (
        state.workoutType === "slowrun" &&
        state.completedExercises.length === 0
      ) {
        state.completedExercises = [
          {
            id: "slowrun-session",
            name: "超慢跑",
            time: state.sessionInfo.totalDuration,
            rest: 0,
          },
        ];

        // 更新初始計劃以便於記錄
        state.initialWorkoutPlan = [...state.completedExercises];
      }

      // 將狀態設為已完成
      state.status = "finished";
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
  },
});

export const {
  setWorkoutType,
  setBpm,
  toggleMetronome,
  setStatus,
  setWorkoutPlan,
  startSlowRun,
  completeWorkout,
  updateCurrentExerciseTime,
  updateCurrentRestTime,
  moveToNextExercise,
  skipCurrentExercise,
  resetWorkout,
  setError,
  clearError,
} = exerciseSlice.actions;

// 新的選擇器
export const selectStatus = (state: RootState) => state.exercise.status;
export const selectWorkoutType = (state: RootState) =>
  state.exercise.workoutType;
export const selectBpm = (state: RootState) => state.exercise.bpm;
export const selectMetronomeActive = (state: RootState) =>
  state.exercise.metronomeActive;
export const selectIsSlowRun = (state: RootState) =>
  state.exercise.workoutType === "slowrun";
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

export default exerciseSlice.reducer;
