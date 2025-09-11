interface WorkoutItem {
  // id
  id: number;
  // 運動名稱
  title: string;
  // 剩餘運動的時間
  exerciseTimes: number;
  // 剩餘的組數
  set: number;
  // 剩餘的休息時間
  restTimes: number;
  // 剩餘的準備時間
  prepareTimes: number;
  // 規格
  requiredItem: {
    // 需要的時間
    time: number;
    // 需要的休息時間
    rest: number;
    // 需要的準備時間
    prepare: number;
    // 需要的組數
    set: number;
  };
}
