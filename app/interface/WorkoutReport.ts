export interface WorkoutSession {
  id: string;
  userId: string;
  date: string; // ISO 日期字符串 (YYYY-MM-DD)
  duration: number; // 單位：分鐘
  workoutType: string;
  calories?: number; // 可選的卡路里消耗
  notes?: string; // 可選的備註
  createdAt: string; // ISO 日期時間字符串
}

export interface WorkoutSummary {
  totalDuration: number; // 總運動時間（分鐘）
  workoutCount: number; // 運動次數
  averageDuration: number; // 平均每次運動時間
  totalCalories?: number; // 總卡路里消耗
  byWorkoutType: {
    [key: string]: {
      count: number;
      totalDuration: number;
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
