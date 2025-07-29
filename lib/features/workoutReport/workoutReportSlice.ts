import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { database, auth } from "@/app/firebase";
import {
  ref,
  set,
  push,
  get,
  query,
  orderByChild,
  startAt,
  endAt,
} from "firebase/database";
import {
  WorkoutSession,
  WorkoutSummary,
  WorkoutReport,
} from "@/app/interface/WorkoutReport";
import { RootState } from "../../store";

// 獲取當前用戶ID的輔助函數
const getCurrentUserId = () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("用戶未登入");
  }
  return user.uid;
};

// 日期輔助函數
const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0]; // 返回 YYYY-MM-DD 格式
};

const formatYearWeek = (date: Date) => {
  const year = date.getFullYear();
  // 獲取當年第一天
  const firstDayOfYear = new Date(year, 0, 1);
  // 計算當年第一天是星期幾 (0-6)
  const dayOfWeek = firstDayOfYear.getDay() || 7; // 如果是0（星期日）則轉為7
  // 計算日期是當年第幾天
  const dayOfYear =
    Math.floor(
      (date.getTime() - firstDayOfYear.getTime()) / (24 * 60 * 60 * 1000)
    ) + 1;
  // 計算週數
  const weekNumber = Math.ceil((dayOfYear + dayOfWeek - 1) / 7);
  // 返回 YYYY-WW 格式
  return `${year}-${weekNumber.toString().padStart(2, "0")}`;
};

const formatYearMonth = (date: Date) => {
  return date.toISOString().substring(0, 7); // 返回 YYYY-MM 格式
};

const formatYear = (date: Date) => {
  return date.getFullYear().toString(); // 返回 YYYY 格式
};

// 建立新的運動記錄
export const addWorkoutSession = createAsyncThunk(
  "workoutReport/addWorkoutSession",
  async (workoutData: Omit<WorkoutSession, "id" | "userId" | "createdAt">) => {
    try {
      // 檢查用戶是否已登入
      const user = auth.currentUser;
      if (!user) {
        console.error("無法添加運動記錄：用戶未登入");
        throw new Error("用戶未登入，請先登入再保存數據");
      }

      const userId = user.uid;
      console.log("正在保存運動記錄，用戶ID:", userId);

      // 檢查數據庫連接狀態
      if (!database) {
        console.error("Firebase 數據庫未正確初始化");
        throw new Error("數據庫連接錯誤");
      }

      // 創建引用
      const workoutListRef = ref(database, `workouts/${userId}`);
      const newWorkoutRef = push(workoutListRef);

      const timestamp = new Date().toISOString();
      const newWorkout: WorkoutSession = {
        ...workoutData,
        id: newWorkoutRef.key || "",
        userId,
        createdAt: timestamp,
      };

      console.log("正在寫入數據:", `workouts/${userId}/${newWorkoutRef.key}`);

      // 嘗試寫入數據
      await set(newWorkoutRef, newWorkout);
      console.log("數據寫入成功");

      return newWorkout;
    } catch (error: any) {
      console.error("保存運動記錄出錯:", error);

      // 處理常見的 Firebase 錯誤
      if (error.message && error.message.includes("PERMISSION_DENIED")) {
        throw new Error(
          "權限被拒絕：請確認 Firebase 數據庫安全規則已正確設置，允許已登入用戶寫入數據"
        );
      }

      throw new Error(`新增運動記錄失敗: ${error.message}`);
    }
  }
);

// 獲取用戶的運動記錄
export const fetchWorkoutSessions = createAsyncThunk(
  "workoutReport/fetchWorkoutSessions",
  async (dateRange: { startDate: string; endDate: string }) => {
    try {
      // 檢查用戶是否已登入
      const user = auth.currentUser;
      if (!user) {
        console.log("用戶未登入，無法獲取運動記錄");
        return [];
      }

      const userId = user.uid;
      console.log("查詢用戶ID:", userId);
      const { startDate, endDate } = dateRange;
      console.log("查詢日期範圍:", startDate, "到", endDate);

      // 先嘗試獲取所有記錄，然後在程式中過濾
      const workoutRef = ref(database, `workouts/${userId}`);
      console.log("查詢路徑:", `workouts/${userId}`);

      const snapshot = await get(workoutRef);
      const workouts: WorkoutSession[] = [];

      if (snapshot.exists()) {
        console.log("找到運動記錄!");
        snapshot.forEach((childSnapshot) => {
          const workout = childSnapshot.val() as WorkoutSession;

          // 在 JavaScript 中進行日期過濾，而不是依賴於 Firebase 查詢
          if (workout.date >= startDate && workout.date <= endDate) {
            workouts.push(workout);
          }
        });

        console.log(`找到 ${workouts.length} 條符合日期範圍的記錄`);
      } else {
        console.log("未找到任何運動記錄");
      }

      return workouts;
    } catch (error: any) {
      console.error("獲取運動記錄失敗:", error);
      throw new Error(`獲取運動記錄失敗: ${error.message}`);
    }
  }
);

// 生成運動報表
export const generateWorkoutReport = createAsyncThunk(
  "workoutReport/generateReport",
  async (dateRange: { startDate: string; endDate: string }, { dispatch }) => {
    try {
      const sessions = await dispatch(fetchWorkoutSessions(dateRange)).unwrap();

      // 初始化報表結構
      const report: WorkoutReport = {
        daily: {},
        weekly: {},
        monthly: {},
        yearly: {},
      };

      // 處理每個運動記錄
      sessions.forEach((session) => {
        const date = new Date(session.date);
        const dayKey = formatDate(date);
        const weekKey = formatYearWeek(date);
        const monthKey = formatYearMonth(date);
        const yearKey = formatYear(date);

        // 更新日報表
        if (!report.daily[dayKey]) {
          report.daily[dayKey] = createEmptySummary();
        }
        updateSummary(report.daily[dayKey], session);

        // 更新週報表
        if (!report.weekly[weekKey]) {
          report.weekly[weekKey] = createEmptySummary();
        }
        updateSummary(report.weekly[weekKey], session);

        // 更新月報表
        if (!report.monthly[monthKey]) {
          report.monthly[monthKey] = createEmptySummary();
        }
        updateSummary(report.monthly[monthKey], session);

        // 更新年報表
        if (!report.yearly[yearKey]) {
          report.yearly[yearKey] = createEmptySummary();
        }
        updateSummary(report.yearly[yearKey], session);
      });

      return report;
    } catch (error: any) {
      throw new Error(`生成運動報表失敗: ${error.message}`);
    }
  }
);

// 創建空的摘要對象
const createEmptySummary = (): WorkoutSummary => ({
  totalDuration: 0,
  workoutCount: 0,
  averageDuration: 0,
  totalCalories: 0,
  byWorkoutType: {},
});

// 更新摘要對象
const updateSummary = (summary: WorkoutSummary, session: WorkoutSession) => {
  // 更新總時長
  summary.totalDuration += session.duration;

  // 更新運動次數
  summary.workoutCount += 1;

  // 更新卡路里（如果有）
  if (session.calories) {
    summary.totalCalories = (summary.totalCalories || 0) + session.calories;
  }

  // 更新按運動類型的統計
  if (!summary.byWorkoutType[session.workoutType]) {
    summary.byWorkoutType[session.workoutType] = {
      count: 0,
      totalDuration: 0,
    };
  }
  summary.byWorkoutType[session.workoutType].count += 1;
  summary.byWorkoutType[session.workoutType].totalDuration += session.duration;

  // 重新計算平均時長
  summary.averageDuration = summary.totalDuration / summary.workoutCount;
};

// 定義 Slice 的 state 類型
interface WorkoutReportState {
  workoutSessions: WorkoutSession[];
  report: WorkoutReport | null;
  loading: boolean;
  error: string | null;
  selectedTimeRange: "daily" | "weekly" | "monthly" | "yearly";
}

// 初始狀態
const initialState: WorkoutReportState = {
  workoutSessions: [],
  report: null,
  loading: false,
  error: null,
  selectedTimeRange: "weekly",
};

// 創建 slice
const workoutReportSlice = createSlice({
  name: "workoutReport",
  initialState,
  reducers: {
    setSelectedTimeRange: (
      state,
      action: PayloadAction<"daily" | "weekly" | "monthly" | "yearly">
    ) => {
      state.selectedTimeRange = action.payload;
    },
    clearWorkoutReportError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 處理添加運動記錄
      .addCase(addWorkoutSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addWorkoutSession.fulfilled, (state, action) => {
        state.loading = false;
        state.workoutSessions.push(action.payload);
      })
      .addCase(addWorkoutSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "添加運動記錄失敗";
      })

      // 處理獲取運動記錄
      .addCase(fetchWorkoutSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkoutSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.workoutSessions = action.payload;
      })
      .addCase(fetchWorkoutSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "獲取運動記錄失敗";
      })

      // 處理生成報表
      .addCase(generateWorkoutReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateWorkoutReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload;
      })
      .addCase(generateWorkoutReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "生成運動報表失敗";
      });
  },
});

// 導出 action
export const { setSelectedTimeRange, clearWorkoutReportError } =
  workoutReportSlice.actions;

// 導出 selector
export const selectWorkoutSessions = (state: RootState) =>
  state.workoutReport.workoutSessions;
export const selectWorkoutReport = (state: RootState) =>
  state.workoutReport.report;
export const selectWorkoutReportLoading = (state: RootState) =>
  state.workoutReport.loading;
export const selectWorkoutReportError = (state: RootState) =>
  state.workoutReport.error;
export const selectSelectedTimeRange = (state: RootState) =>
  state.workoutReport.selectedTimeRange;

// 導出 reducer
export default workoutReportSlice.reducer;
