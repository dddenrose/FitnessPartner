export interface WorkoutSession {
  id: string;
  userId: string;
  date: string; // ISO 日期字符串 (YYYY-MM-DD)
  duration: number; // 單位：分鐘
  workoutType: string; // 運動類型，例如 "hiit" 或 "slowrun"
  calories?: number; // 可選的卡路里消耗
  exercises?: Array<{
    name: string; // 動作名稱
    sets: number; // 組數
    reps?: number; // 次數
    time?: number; // 時間 (秒)
    rest: number; // 休息時間 (秒)
  }>; // 具體的運動項目
  createdAt: string; // ISO 日期時間字符串
}

export interface WorkoutSummary {
  totalDuration: number; // 總運動時間（分鐘）
  workoutCount: number; // 運動次數
  averageDuration: number; // 平均每次運動時間
  byWorkoutType: {
    [key: string]: {
      count: number;
      totalDuration: number;
      averageDuration: number;
    };
  };
}

export interface WorkoutReport {
  daily: {
    [key: string]: WorkoutSummary; // 按日期索引
  };
  weekly: {
    [key: string]: WorkoutSummary; // 按週索引，格式為 "YYYY-WW"
  };
  monthly: {
    [key: string]: WorkoutSummary; // 按月份索引，格式為 "YYYY-MM"
  };
  yearly: {
    [key: string]: WorkoutSummary; // 按年份索引
  };
}
